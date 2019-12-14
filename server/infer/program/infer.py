from learn import *
import pickle

from learn import rNet

# infer using trained RNN model.
if __name__ == "__main__":
    istraining = False
    usepreviousdata = True
    device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
    print("device is:", device)

    net = rNet()
    net.load_state_dict(torch.load('../model/model.pth'))

    with open('../data/testdata.pickle',mode='rb') as f:
        song=pickle.load(f)
    print(song.feats.shape)
    len_seq = 500
    net.to(device)
    inference = net.infer(song.feats, len_seq, device)
    inference = np.reshape(inference, (-1))
    with open('../data/inference.pickle', mode='wb') as f:
        pickle.dump(inference, f)
