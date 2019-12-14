from learn import *
import pickle
import matplotlib.pyplot as plt

def view_weight(m):
    if type(m) == nn.Conv2d:
        for i in range(m.weight.data.numpy().shape[0]):
            plt.subplot(m.weight.data.numpy().shape[0]//4+1,4,i+1)
            specshow(m.weight.data.numpy()[i,0])
        plt.colorbar()
        plt.show()

if __name__ == "__main__":
    device = torch.device("cuda:1" if torch.cuda.is_available() else "cpu")
    net = convNet()
    print(net)
    net.load_state_dict(torch.load('../model/convmodelonset.pth'))

    net.apply(view_weight)

    # with open('../data/testdata.pickle', mode='rb') as f:
        # song = pickle.load(f)
