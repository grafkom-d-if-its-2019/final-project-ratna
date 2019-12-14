import torch
import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim
from musicprocessor import *
from tqdm import tqdm
import numpy as np


class rNet(nn.Module):
    """ copies the neural net used in Dance Dance Convolution.  https://arxiv.org/abs/1703.06891 """

    def __init__(self):
        super(rNet, self).__init__()
        self.conv1 = nn.Conv2d(3, 10, (3, 7))
        self.conv2 = nn.Conv2d(10, 20, 3)
        self.conv2_bn = nn.BatchNorm2d(20, track_running_stats=False)
        self.lstm1 = nn.LSTM(1120, 200, batch_first=True)
        self.lstm2 = nn.LSTM(200, 200, batch_first=True)
        self.fc1 = nn.Linear(200, 256)
        self.fc2 = nn.Linear(256, 120)
        self.fc3 = nn.Linear(120, 1)

    def forward(self, x, hc1=None, hc2=None, len_seq=3000, minibatch=1, istraining=False, usepreviousdata=False):
        if istraining:
            x = x.view(minibatch*len_seq, x.shape[2], x.shape[3], x.shape[4])
        x = F.max_pool2d(F.relu(self.conv1(x)), (3, 1))
        x = F.max_pool2d(self.conv2_bn(F.relu(self.conv2(x))), (3, 1))
        if not istraining:
            x = x.view(1, len_seq, -1)
        else:
            x = x.view(minibatch, len_seq, -1)

        if usepreviousdata:
            if hc1 is not None:
                x, hc1out = self.lstm1(x, hc1)
                x = F.dropout(x, training=istraining)
                x, hc2out = self.lstm2(x, hc2)
            else:
                x, hc1out = self.lstm1(x)
                x = F.dropout(x, training=istraining)
                x, hc2out = self.lstm2(x)
        else:
            x, _ = self.lstm1(x)
            x = F.dropout(x, training=istraining)
            x, _ = self.lstm2(x)

        x = F.dropout(x, training=istraining)
        x = F.dropout(F.relu(self.fc1(x)), training=istraining)
        x = F.dropout(F.relu(self.fc2(x)), training=istraining)
        if usepreviousdata:
            return F.sigmoid(self.fc3(x)), hc1out, hc2out
        else:
            return F.sigmoid(self.fc3(x))

    def num_flat_features(self, x):
        size = x.size()[1:]
        num_features = 1
        for s in size:
            num_features *= s
        return num_features

    def learninggenerator(self, feats, answers, len_seq, soundlen=15, minibatch=1, split=0.2):
        idx = np.random.permutation(
            answers.shape[0]-len_seq-soundlen*3)+soundlen
        idx = idx[:int(idx.shape[0]*split)]
        Xbatch, ybatch = [], []
        X, y = [], []
        j = 0
        for i in range(idx.shape[0]):
            # for k in range(len_seq):
                # Xbatch.append(feats[:, :, idx[i]+k-soundlen//2:idx[i]+k+soundlen//2+1])
                # ybatch.append(answers[idx[i]+k])
            Xbatch = np.array(
                [feats[:, :, idx[i]+k-soundlen//2:idx[i]+k+soundlen//2+1] for k in range(len_seq)])
            ybatch = np.array([answers[idx[i]+k] for k in range(len_seq)])
            X.append(Xbatch)
            y.append(ybatch)
            Xbatch, ybatch = [], []
            j += 1
            if j % minibatch == 0:
                yield(torch.from_numpy(np.array(X)).float(), torch.from_numpy(np.array(y)).float())
                X, y = [], []

    def train(self, songs, len_seq, minibatch, epochs, device, soundlen=15, saveplace="../model/model.pth", logplace='./rout.pth'):
        for song in songs:
            timing = song.timestamp[:, 0]
            sound = song.timestamp[:, 1]
            song.answer = np.zeros((song.feats.shape[2]))
            # print(song.feats.shape)
            # print(timing[-1])
            # print(song.samplerate)
            major_note_index = np.rint(timing[np.where(sound != 0)]
                                       * song.samplerate/512).astype(np.int32)
            major_note_index = np.delete(major_note_index, np.where(
                major_note_index >= song.feats.shape[2]))
            # print(song.feats.shape)
            song.answer[major_note_index] = 1
            song.answer = milden(song.answer, 2)

        optimizer = optim.SGD(net.parameters(), lr=0.02)
        # optimizer = optim.Adam(net.parameters(), lr=0.01)
        j = -1
        running_loss = 0
        split = 0.1
        for i in range(epochs):
            print("epoch:", i)
            for song in songs:
                for X, y in tqdm(self.learninggenerator(song.feats, song.answer, len_seq, soundlen, minibatch, split=split), total=(song.answer.shape[0]*split-len_seq-soundlen)//minibatch):
                    optimizer.zero_grad()
                    output = net(X.to(device), len_seq=len_seq,
                                 istraining=True, minibatch=minibatch)
                    target = y.to(device)
                    criterion = nn.MSELoss()
                    loss = criterion(output.squeeze(), target)
                    loss.backward()
                    optimizer.step()
                    running_loss += loss.data.item()
                    j += 1
                print("running loss is", running_loss/j)
                running_loss = 0
                j = 0
            torch.save(net.state_dict(), saveplace)

    def inferencegenerator(self, feats, len_seq, soundlen=15):
        x = []
        for i in range(feats.shape[2]-soundlen):
            x.append(feats[:, :, i:i+soundlen])
            if i % len_seq == len_seq-1:
                print(np.array(x).shape)
                yield(torch.from_numpy(np.array(x)).float(), i)
                x = []

    def infer(self, feats, len_seq, device):
        h1, h2 = None, None
        inference = []
        with torch.no_grad():
            for x, i in tqdm(self.inferencegenerator(feats, len_seq), total=feats.shape[2]//len_seq):
                output, h1, h2 = self(
                    x.to(device), h1, h2, len_seq, usepreviousdata=True)
                inference.append(output.cpu().numpy())
            return np.array(inference)


class convNet(nn.Module):
    """
    copies the neural net used in a paper "Improved musical onset detection with Convolutional Neural Networks".
    https://ieeexplore.ieee.org/document/6854953
    seemingly no-RNN version of rNet.
    """

    def __init__(self):
        super(convNet, self).__init__()
        self.conv1 = nn.Conv2d(3, 10, (3, 7))
        self.conv2 = nn.Conv2d(10, 20, 3)
        self.fc1 = nn.Linear(1120, 256)
        self.fc2 = nn.Linear(256, 120)
        self.fc3 = nn.Linear(120, 1)

    def forward(self, x, istraining=False, minibatch=1):
        x = F.max_pool2d(F.relu(self.conv1(x)), (3, 1))
        x = F.max_pool2d(F.relu(self.conv2(x)), (3, 1))
        x = F.dropout(x.view(minibatch, -1), training=istraining)
        x = F.dropout(F.relu(self.fc1(x)), training=istraining)
        x = F.dropout(F.relu(self.fc2(x)), training=istraining)
        return F.sigmoid(self.fc3(x))

    def num_flat_features(self, x):
        size = x.size()[1:]
        num_features = 1
        for s in size:
            num_features *= s
        return num_features

    @jit
    def learninggenerator(self, feats, answers, samplerate, soundlen=15, minibatch=1, split=1):
        idx = np.random.permutation(
            np.arange(answers.shape[0]-3*soundlen))+soundlen
        X, y = [], []
        j = 0
        for i in range(int(idx.shape[0]*split)):
            if answers[idx[i]] != 0:
                X.append(feats[:, :, idx[i]-soundlen//2:idx[i]+soundlen//2+1])
                y.append(answers[idx[i]])
                j += 1
                if j % minibatch == 0:
                    yield(torch.from_numpy(np.array(X)).float(), torch.from_numpy(np.array(y)).float())
                    X, y = [], []

    # return the data between notes with moderate interval.
    @jit
    def learninggenerator2(self, feats, answers, major_note_index, samplerate, soundlen=15, minibatch=1, split=1):
        # acceptable interval in seconds
        minspace = 0.1
        maxspace = 0.7
        idx = np.random.permutation(
            major_note_index.shape[0]-soundlen)+soundlen//2
        X, y = [], []
        j = 0
        for i in range(int(idx.shape[0]*split)):
            dist = major_note_index[idx[i]+1]-major_note_index[idx[i]]
            if dist < maxspace*samplerate/512 and dist > minspace*samplerate/512:
                for k in range(-1, dist+2):
                    X.append(feats[:, :, major_note_index[idx[i]]-soundlen //
                                   2+k:major_note_index[idx[i]]+soundlen//2+k+1])
                    y.append(answers[major_note_index[idx[i]]+k])
                    j += 1
                    if j % minibatch == 0:
                        yield(torch.from_numpy(np.array(X)).float(), torch.from_numpy(np.array(y)).float())
                        X, y = [], []

    def inferencegenerator(self, feats, soundlen=15, minibatch=1):
        x = []
        for i in range(feats.shape[2]-soundlen):
            x.append(feats[:, :, i:i+soundlen])
            if i % minibatch == minibatch-1:
                yield(torch.from_numpy(np.array(x)).float())
                x = []
        if len(x) != 0:
            yield(torch.from_numpy(np.array(x)).float())

    def train(self, songs, minibatch, epochs, device, soundlen=15, valsong=None, saveplace='../model/convmodel.pth', logplace='./out.txt', usedonka=0):
        """when usedonka is 0 uses both."""
        optimizer = optim.SGD(self.parameters(), lr=0.02)
        # optimizer = optim.Adam(self.parameters(), lr=0.03)

        for song in songs:
            timing = song.timestamp[:, 0]
            sound = song.timestamp[:, 1]
            song.answer = np.zeros((song.feats.shape[2]))
            if usedonka == 0:
                song.major_note_index = np.rint(timing[np.where(sound != 0)]
                                                * song.samplerate/512).astype(np.int32)
            else:
                song.major_note_index = np.rint(timing[np.where(sound == usedonka)]
                                                * song.samplerate/512).astype(np.int32)
                song.minor_note_index = np.rint(timing[np.where(sound == 3-usedonka)]
                                                * song.samplerate/512).astype(np.int32)
            song.major_note_index = np.delete(song.major_note_index, np.where(
                song.major_note_index >= song.feats.shape[2]))
            song.minor_note_index = np.delete(song.minor_note_index, np.where(
                song.minor_note_index >= song.feats.shape[2]))
            song.answer[song.major_note_index] = 1
            song.answer[song.minor_note_index] = 0.26
            song.answer = milden(song.answer)

        running_loss = 0
        val_loss = 0
        criterion = nn.MSELoss()
        # criterion = nn.CrossEntropyLoss()
        # validate if valsong is given
        if valsong:
            timing = valsong.timestamp[:, 0]
            sound = valsong.timestamp[:, 1]
            valsong.answer = np.zeros((valsong.feats.shape[2]))
            if usedonka == 0:
                valsong.major_note_index = np.rint(timing[np.where(sound != 0)]
                                                   * valsong.samplerate/512).astype(np.int32)
            else:
                valsong.major_note_index = np.rint(timing[np.where(sound == usedonka)]
                                                   * valsong.samplerate/512).astype(np.int32)
                valsong.minor_note_index = np.rint(timing[np.where(sound == 3-usedonka)]
                                                   * valsong.samplerate/512).astype(np.int32)
            valsong.major_note_index = np.delete(valsong.major_note_index, np.where(
                valsong.major_note_index >= valsong.feats.shape[2]))
            valsong.minor_note_index = np.delete(valsong.minor_note_index, np.where(
                valsong.minor_note_index >= valsong.feats.shape[2]))
            valsong.answer[valsong.major_note_index] = 1
            valsong.answer[valsong.minor_note_index] = 0.26
            valsong.answer = milden(valsong.answer)

        previous_val_loss = 1

        for i in range(epochs):
            print("epoch:", i)
            for song in songs:
                # for X, y in self.learninggenerator(song.feats, song.answer, song.samplerate, soundlen, minibatch, split=1):
                for X, y in self.learninggenerator2(song.feats, song.answer, song.major_note_indew, song.samplerate, soundlen, minibatch, split=0.2):
                    optimizer.zero_grad()
                    output = self(X.to(device), istraining=True,
                                  minibatch=minibatch)
                    target = y.to(device)
                    loss = criterion(output.squeeze(), target)
                    loss.backward()
                    optimizer.step()
                    running_loss += loss.data.item()
            with open(logplace, 'a') as f:
                print("running loss is", running_loss, file=f)
            running_loss = 0
            if valsong:
                inference = torch.from_numpy(self.infer(
                    valsong.feats, device, minibatch=512)).to(device)
                target = torch.from_numpy(
                    valsong.answer[:-soundlen]).float().to(device)
                loss = criterion(inference.squeeze(), target)
                val_loss = loss.data.item()
                with open(logplace, 'a') as f:
                    print("validation loss is \t\t\t\t",
                          val_loss, file=f)
                if previous_val_loss > val_loss:
                    torch.save(self.state_dict(), saveplace)
                    previous_val_loss = val_loss
                # val_loss = 0

    def infer(self, feats, device, minibatch=1):
        with torch.no_grad():
            inference = None
            for x in tqdm(self.inferencegenerator(feats, minibatch=minibatch), total=feats.shape[2]//minibatch):
                output = self(x.to(device), minibatch=x.shape[0])
                if inference is not None:
                    inference = np.concatenate(
                        (inference, output.cpu().numpy().reshape(-1)))
                else:
                    inference = output.cpu().numpy().reshape(-1)
            return np.array(inference).reshape(-1)


class reducedNet(convNet):
    def __init__(self):
        super(convNet, self).__init__()
        self.conv1 = nn.Conv2d(3, 10, (3, 7))
        self.conv2 = nn.Conv2d(10, 20, 3)
        self.fc1 = nn.Linear(1120, 256)
        self.fc2 = nn.Linear(256, 120)
        self.fc3 = nn.Linear(120, 1)

    def forward(self, x, istraining=False, minibatch=1):
        x = F.max_pool2d(F.relu(self.conv1(x)), (3, 1))
        x = F.max_pool2d(F.relu(self.conv2(x)), (3, 1))
        x = F.dropout(x.view(minibatch, -1), training=istraining)
        x = F.dropout(F.relu(self.fc1(x)), training=istraining)
        x = F.dropout(F.relu(self.fc2(x)), training=istraining)
        return F.sigmoid(self.fc3(x))


if __name__ == "__main__":
    device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
    net = rNet()
    print(net)
    net = net.to(device)

    # delete if you want to train from scratch
    net.load_state_dict(torch.load('../model/rmodel.pth'))

    with open('../data/learningdata.pickle', mode='rb') as f:
        songs = pickle.load(f)

    len_seq = 100
    minibatch = 100
    soundlen = 15
    epochs = 30
    net.train(songs=songs, len_seq=len_seq, minibatch=minibatch,
              epochs=epochs, device=device, soundlen=soundlen, saveplace='../model/rmodel.pth', logplace='./rout20.txt')
