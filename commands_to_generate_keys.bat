mkdir cert
cd cert
openssl genrsa -out quiz-fra03r-key.pem 2048
openssl req -new -sha256 -key quiz-fra03r-key.pem -out quiz-fra03r-csr.pem
openssl x509 -req -in quiz-fra03r-csr.pem -signkey quiz-fra03r-key.pem -out quiz-fra03r-cert.pem
