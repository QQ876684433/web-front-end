.PHONY: convert identify login all

all: convert identify

convert: 1.png 2.png 3.png 4.png 5.png 6.png
	convert -interlace Plane -quality 100 1.png progressive/1.jpg
	convert -interlace Plane -quality 100 2.png progressive/2.jpg
	convert -interlace Plane -quality 100 3.png progressive/3.jpg
	convert -interlace Plane -quality 100 4.png progressive/4.jpg
	convert -interlace Plane -quality 100 5.png progressive/5.jpg
	convert -interlace Plane -quality 100 6.png progressive/6.jpg

identify: progressive/1.jpg progressive/2.jpg progressive/3.jpg progressive/4.jpg progressive/5.jpg progressive/6.jpg
	identify -verbose progressive/1.jpg | grep Interlace
	identify -verbose progressive/2.jpg | grep Interlace
	identify -verbose progressive/3.jpg | grep Interlace
	identify -verbose progressive/4.jpg | grep Interlace
	identify -verbose progressive/5.jpg | grep Interlace
	identify -verbose progressive/6.jpg | grep Interlace

login: ../login.jpg
	convert -interlace Plane -quality 100 ../login.jpg ../login.jpeg
	identify -verbose ../login.jpeg | grep Interlace
