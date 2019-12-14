from learn import *
import sys

if __name__ == "__main__":
    device = torch.device("cuda:1" if torch.cuda.is_available() else "cpu")
    net = convNet()
    print(net)
    net = net.to(device)

    modelpth='../model/convmodelonset.pth'
    # delete this if you want to train from scratch
    # net.load_state_dict(torch.load(modelpth))

    with open('../data/pickles/learningdata.pickle', mode='rb') as f:
        songs=pickle.load(f)
    with open('../data/pickles/valdata.pickle', mode='rb') as f:
        valsong=pickle.load(f)

    minibatch = 128
    soundlen = 15
    epochs = 70
    # val_train_split = int(feats.shape[1]*0.96)
    print(sys.argv[1])
    if sys.argv[1] == 'don':
        net.train(songs=songs, minibatch=minibatch, valsong=valsong,
              epochs=epochs, device=device, soundlen=soundlen, saveplace=modelpth+'don', logplace='./convoutonset0.8don.txt', usedonka=1)
    if sys.argv[1] == 'ka':
        net.train(songs=songs, minibatch=minibatch, valsong=valsong,
              epochs=epochs, device=device, soundlen=soundlen, saveplace=modelpth+'ka', logplace='./convoutonset0.8ka.txt', usedonka=2)
    if sys.argv[1] == 'both':
        net.train(songs=songs, minibatch=minibatch, valsong=valsong,
              epochs=epochs, device=device, soundlen=soundlen, saveplace=modelpth, logplace='./convoutonset.txt', usedonka=0)

