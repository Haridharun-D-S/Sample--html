from flask import Flask

app = Flask(__name__)

@app.route("/")
def home():
    for i in range(0,5,1):
    print("Hello",i,end="\n")
    print("ok")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)


