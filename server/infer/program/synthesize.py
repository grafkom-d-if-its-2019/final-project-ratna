import pickle
import numpy as np
from musicprocessor import *
from scipy.signal import argrelmax
from librosa.util import peak_pick
from librosa.onset import onset_detect
import json

def relative(inference, song):
    inference = smooth(inference)
    relinf = argrelmax(inference)
    inferredtimestamp = relinf[0]
    inferredtimestamp = (inferredtimestamp+7)*512/song.samplerate
    song.timestamp = inferredtimestamp
    song.synthesize(diff=False)
    print(len(inferredtimestamp))
    song.save("../data/inferredmusic.wav")


def absolute(inference, song):
    inferredtimestamp = []
    for i in range(len(inference)):
        if inference[i] >= 0.2:
            inferredtimestamp.append((i+7)*512/song.samplerate)
    song.timestamp = inferredtimestamp
    song.synthesize(diff=False)
    print(len(inferredtimestamp))
    song.save("../data/inferredmusic.wav")


def both(inference, song):
    inference = smooth(inference, 5)
    relinf = argrelmax(inference)[0]
    inferredtimestamp = []
    for i in range(len(relinf)):
        if inference[relinf[i]] >= 0.3:
            inferredtimestamp.append((relinf[i]+7)*512/song.samplerate)
    print(len(inferredtimestamp))
    print(song.data.shape)
    print(inference.shape)
    # plt.ylim((0,1))
    plt.plot(inference)

    timing = song.timestamp[:, 0]
    sound = song.timestamp[:, 1]
    song.answer = np.zeros((song.feats.shape[2]))
    shouldbeone = np.rint(timing[np.where(sound != 0)]
                          * song.samplerate/512).astype(np.int32)
    shouldbeone = np.delete(shouldbeone, np.where(
        shouldbeone >= song.feats.shape[2]))
    song.answer[shouldbeone] = 1
    # song.answer = milden(song.answer, 2)
    song.answer = recen(song.answer)
    # plt.plot(song.answer)
    print(song.answer.shape)

    plt.show()
    song.timestamp = inferredtimestamp
    song.synthesize(diff=False)
    song.save("../data/inferredmusic.wav")


def by_librosa_detection(inference, song):
    song.timestamp = (onset_detect(onset_envelope=inference,
                                   sr=song.samplerate, hop_length=512)+7)*512/song.samplerate
    print(len(song.timestamp))
    song.synthesize(diff=False)
    song.save("../data/inferredmusic.wav")


def by_librosa_detection2(inference, song):
    inference = smooth(inference, 5)
    song.timestampboth = (peak_pick(inference, 1, 2, 4, 5,
                                0.12, 3)+7)
    song.timestamp=song.timestampboth*512/song.samplerate
    print(len(song.timestamp))
    song.synthesize(diff=False)
    song.save("../data/inferredmusic.wav")


def by_librosa_detection3(inferencedon, inferenceka, song):
    """detects notes distinguishing don and ka"""
    inferencedon = smooth(inferencedon, 5)
    # inferenceka = smooth(inferenceka, 5)
    print(peak_pick(inferencedon, 1, 2, 4, 5, 0.05, 3)+7)
    timestampdon = (peak_pick(inferencedon, 1, 2, 4, 5,
                              0.05, 3)+7)
    # timestampka = (peak_pick(inferenceka, 1, 2, 4, 5,
    #                          0.05, 3)+7)
    # song.timestampdon = timestampdon[np.where(
    #     inferencedon[timestampdon] > inferenceka[timestampdon])]
    # song.timestamp=song.timestampdon*512/song.samplerate
    # print(len(song.timestamp))
    res = np.array(timestampdon*512/song.samplerate)
    # print(res)
    # song.synthesize(diff='don')
    # song.timestampka = timestampka[np.where(
    #     inferenceka[timestampka] > inferencedon[timestampka])]
    # song.timestamp=song.timestampka*512/song.samplerate
    # print(len(song.timestamp))
    # res2 = np.array(song.timestamp)
    # print(res2)
    # res = np.concatenate((res,res2))
    # res = np.sort(res)
    
    with open('../beats.json','w') as outfile:
        json.dump(res.tolist(),outfile)
    



    # song.synthesize(diff='ka')
    song.save("../data/inferredmusic.wav")

def by_librosa_detection4(inferencedon, inferenceka, song):
    """detects notes distinguishing don and ka. this is the right one?"""
    inferencedon = smooth(inferencedon, 5)
    inferenceka = smooth(inferenceka, 5)
    timestampdon = (peak_pick(inferencedon, 1, 2, 4, 5,
                              0.05, 3)+7)
    timestampka = (peak_pick(inferenceka, 1, 2, 4, 5,
                             0.05, 3)+7)
    song.timestampdon = timestampdon[np.where(
        inferencedon[timestampdon-7] > inferenceka[timestampdon-7])]
    song.timestamp=song.timestampdon*512/song.samplerate
    # print(len(song.timestamp))
    song.synthesize(diff='don')
    song.timestampka = timestampka[np.where(
        inferenceka[timestampka-7] > inferencedon[timestampka-7])]
    song.timestamp=song.timestampka*512/song.samplerate
    # print(len(song.timestamp))
    song.synthesize(diff='ka')
    song.save("../data/inferredmusic.wav")

def create_tja(filename, song, timestampdon, timestampka=None):
    if timestampka is None:
        timestamp=timestampdon*512/song.samplerate
        with open(filename, "w") as f:
            f.write('TITLE: xxx\nSUBTITLE: --\nBPM: 240\nWAVE:xxx.ogg\nOFFSET:0\n#START\n')
            i = 0
            time = 0
            while(i < len(timestamp)):
                if time/100 >= timestamp[i]:
                    f.write('1')
                    i += 1
                else:
                    f.write('0')
                if time % 100 == 99:
                    f.write(',\n')
                time += 1
            f.write('#END')
    else:
        timestampdon=np.rint(timestampdon*512/song.samplerate*100).astype(np.int32)
        timestampka=np.rint(timestampka*512/song.samplerate*100).astype(np.int32)
        with open(filename, "w") as f:
            f.write('TITLE: xxx\nSUBTITLE: --\nBPM: 240\nWAVE:xxx.ogg\nOFFSET:0\n#START\n')
            for time in range(np.max((timestampdon[-1],timestampka[-1]))):
                if np.isin(time,timestampdon) == True:
                    f.write('1')
                elif np.isin(time,timestampka) == True:
                    f.write('2')
                else:
                    f.write('0')
                if time%100==99:
                    f.write(',\n')
            f.write('#END')

if __name__ == "__main__":
    with open('../data/pickles/testdata.pickle', mode='rb') as f:
        song = pickle.load(f)

    if sys.argv[1] == '0':
        with open('../data/inference.pickle', mode='rb') as f:
            inference = pickle.load(f)

    if sys.argv[1] == '1':
        with open('../data/inference.pickle' + 'don', mode='rb') as f:
            inferencedon = pickle.load(f)
        # with open('../data/inference.pickle' + 'ka', mode='rb') as f:
        #     inferenceka = pickle.load(f)

    # by_librosa_detection2(inference, song)
    # create_tja("../data/kondo/9413.tja", song.timestampboth)

    by_librosa_detection3(inferencedon, inferenceka, song)
    # create_tja("../data/kondo/9413.tja",song, song.timestampdon, song.timestampka)
