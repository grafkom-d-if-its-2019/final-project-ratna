from learn import *
import pickle
np.set_printoptions(threshold=sys.maxsize)

# infer using trained CNN model.
if __name__ == "__main__":
    device = torch.device("cuda:1" if torch.cuda.is_available() else "cpu")
    net = convNet()
    print(net)
    net = net.to(device)

    with open('../data/pickles/testdata.pickle', mode='rb') as f:
        song = pickle.load(f)
        print(song)

    if sys.argv[1] == 'both':
        if torch.cuda.is_available():
            net.load_state_dict(torch.load('../model/convmodelonset.pth'))
        else:
            net.load_state_dict(torch.load('../model/convmodelonset.pth',map_location='cpu'))
        inference = net.infer(song.feats, device, minibatch=4192)
        inference = np.reshape(inference, (-1))
        # print(inference)
        with open('../data/inference.pickle', mode='wb') as f:
            pickle.dump(inference, f)
    if sys.argv[1] == 'don':
        if torch.cuda.is_available():
            net.load_state_dict(torch.load('../model/convmodelonset.pth'+'don'))
        else:
            net.load_state_dict(torch.load('../model/convmodelonset.pth'+'don',map_location='cpu'))
        inference = net.infer(song.feats, device, minibatch=4192)
        inference = np.reshape(inference, (-1))
        # print(inference)
        with open('../data/inference.pickle'+'don', mode='wb') as f:
            pickle.dump(inference, f)
    if sys.argv[1] == 'ka':
        if torch.cuda.is_available():
            net.load_state_dict(torch.load('../model/convmodelonset.pth'+'don'))
        else:
            net.load_state_dict(torch.load('../model/convmodelonset.pth'+'don',map_location='cpu'))
        inference = net.infer(song.feats, device, minibatch=4192)
        inference = np.reshape(inference, (-1))
        # print(inference)
        with open('../data/inference.pickle'+'ka', mode='wb') as f:
            pickle.dump(inference, f)
