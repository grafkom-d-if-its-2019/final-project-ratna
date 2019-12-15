call activate base
cd %~dp0
python conversion.py
python musicprocessor.py
python inferconv.py don
python synthesize.py 1