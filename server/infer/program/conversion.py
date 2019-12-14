from pydub import AudioSegment
import os
import glob

print(glob.glob('../data/*.mp3'))
for file in glob.glob('../data/*.mp3'):
    AudioSegment.from_file(file).export('../data/processed.ogg',format='ogg')
    print(file)
