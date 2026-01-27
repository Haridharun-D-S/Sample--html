from flask import Flask, render_template

app=Flask(__name__)

@app.route('/')
def run():
    return render_template("index.html")

@app.route('/home')
def home():
    return render_template("home.html")
    
@app.route('/health')
def health():
    return "OK",200
 
if __name__=="__main__":
    app.run(host="0.0.0.0", port=5000)