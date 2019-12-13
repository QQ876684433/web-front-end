.PHONY: all run

all: ../../server/security/AES.js ../../server/security/RSA.js ./login.js
	babel ../../server/security/AES.js -o ../../server/security/AES-es5.js
	babel ../../server/security/RSA.js -o ../../server/security/RSA-es5.js
	babel ./login.js -o ./login-es5.js
	babel ./register.js -o ./register-es5.js
	browserify login-es5.js > ./bundles/login-bundle.js
	browserify register-es5.js > ./bundles/register-bundle.js

run: all ../../server/App.js
	/usr/bin/babel-node ../../server/App.js
