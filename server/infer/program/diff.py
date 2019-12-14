import soundfile as sf
import matplotlib.pyplot as plt
import numpy as np
import os
from glob import glob
from scipy import signal
from scipy.fftpack import fft
from librosa.filters import mel
from librosa.feature import melspectrogram
from librosa.display import specshow
from librosa import stft
from musicprocessor import Audio,FrameGenerator,fftandmelscale



if __name__ == "__main__":
    # how to use
    serv = "../data/learning/ドーナツホール"
    song = Audio(glob(serv+"/*.ogg")[0])
    feats = fftandmelscale(song.data, song.samplerate)
    # feats = 20*np.log10(feats+1)
    # np.save("../data/feats", feats)
    # song.save("../data/savedmusic.wav")

    song.importtja(
    glob(serv+"/*.tja")[-1], verbose=True)
    feats=feats[0][1:]-feats[0][0:-1]
    specshow(feats)
    plt.tight_layout()
    plt.colorbar()
    plt.show()
