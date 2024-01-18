# Python code in app.py
from flask import Flask, render_template, request, jsonify
import joblib
import numpy as np

app = Flask(__name__, static_folder='static')

classification = {}



@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST', 'OPTIONS'])
def predict():
    if request.method == 'OPTIONS':
        # Respond to the preflight OPTIONS request
        response = app.response_class(
            response='',
            status=200,
            mimetype='application/json'
        )
    elif request.method == 'POST':
        try:
            # 获取十个数据
            data_array = request.json['data']  # list
            # 如果data_array里面有''，删除所有''
            data_array = list(filter(None, data_array))
            # 将data_array转换为numpy数组,并转换为float类型
            data_array = np.array(data_array).astype(float).reshape(1,-1)


            # TODO: 调用你的机器学习模型进行预测，使用 'data_array'
            model = joblib.load('lgb.pkl')
            prediction_result = model.predict(data_array)
            

            # 将预测结果转换为字符串类型
            prediction_result = str(prediction_result[0])

            # Return the prediction result
            response_data = {'result': prediction_result}
            response = jsonify(response_data)
        except Exception as e:
            response_data = {'error': str(e)}
            response = jsonify(response_data)
    
    # Set CORS headers to allow all origins
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')

    return response

if __name__ == '__main__':
    app.run(debug=False)
