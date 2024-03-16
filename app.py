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

# 默认模型为 LightGBM
selected_model = 'lgb.pkl'

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/process_data', methods=['POST'])
def process_data():
    global stored_data  # 使用全局变量

    data = request.data.decode('utf-8')

    # 在这里处理数据，存储在后端
    stored_data = [line.strip() for line in data.split('\n') if line.strip()]  # 以换行符分隔多行数据

    # 获取数据集大小
    dataset_size = len(stored_data)

    return str(dataset_size), 200


@app.route('/predict', methods=['GET'])
def predict():
    global stored_data  # 使用全局变量

    if stored_data is None:
        return jsonify({'error': 'No data available for prediction'}), 400

    # 获取模型预测结果
    input_data = stored_data  # 使用存储的数据

    # 将输入数据转换为 DataFrame 格式，假设数据是以逗号分隔的字符串
    input_data = [list(map(float, line.split(','))) for line in input_data]
    input_data = pd.DataFrame(input_data)

    # 调用你的模型进行预测
    pred = joblib.load(selected_model).predict(input_data)
    prediction_results = [credit_rate[pr] for pr in pred]

    # 返回预测结果
    result = {'results': prediction_results}

    # 清除存储的数据
    stored_data = None

    return jsonify(result), 200


@app.route('/select_model', methods=['POST'])
def select_model():
    global selected_model

    # 获取用户选择的模型
    selected_model = request.form['model']

    return jsonify({'message': f'Selected model: {selected_model}'}), 200


if __name__ == '__main__':
    app.run(debug=False)
