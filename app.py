from flask import Flask, request, jsonify, render_template
import joblib
import pandas as pd

app = Flask(__name__)

# 全局变量，用于存储数据
stored_data = None

# 信用评级编码
credit_rate = {
    0: 'AAA',
    1: 'AA',
    2: 'A',
    3: 'BBB',
    4: 'B',
    5: 'C'}



@app.route('/')
def index():
    return render_template('index.html')

@app.route('/process_data', methods=['POST'])
def process_data():
    global stored_data  # 使用全局变量

    data = request.data.decode('utf-8')

    # 在这里处理数据，存储在后端
    stored_data = list(data.split(','))

    # 获取数据集大小
    dataset_size = len(data.split(','))  # 假设数据以逗号分隔

    return str(dataset_size), 200

@app.route('/predict', methods=['GET'])
def predict():
    global stored_data  # 使用全局变量

    if stored_data is None:
        return jsonify({'error': 'No data available for prediction'}), 400

    # 获取模型预测结果
    input_data = stored_data  # 使用存储的数据
    # 把input_data转换成pandas DataFrame格式，转换str为float
    input_data = [float(i) for i in input_data]
    # 将input转换为(1,-1)
    input_data = pd.DataFrame([input_data])

    pred = joblib.load('lgb.pkl').predict(input_data)  # 调用你的模型进行预测，返回预测结果
    prediction_result = str(credit_rate[pred[0]])
    # prediction_result = '1'

    # 返回预测结果
    result = {'result': prediction_result}

    return jsonify(result), 200


if __name__ == '__main__':
    app.run(debug=False)
