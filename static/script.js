// JavaScript code in script.js
async function makePrediction() {
    // 从十个输入框中获取数据
    const inputDataArray = [];
    for (let i = 0; i < 10; i++) {
        const inputId = "inputData" + i;
        const inputData = document.getElementById(inputId).value;
        inputDataArray.push(inputData);
    }

    try {
        // 发送 POST 请求到后端，传递十个数据
        const response = await fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: inputDataArray }),
        });

        // 解析 JSON 响应
        const result = await response.json();

        // 显示预测结果
        document.getElementById("predictionResult").innerText = "Prediction Result: " + result.result;
    } catch (error) {
        console.error('Error:', error);
        document.getElementById("predictionResult").innerText = "Error during prediction";
    }
}

// JavaScript code in script.js
async function readFile() {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const contents = e.target.result;

            // 处理文件内容，将其分割成数组（以逗号为分隔符）
            const data_array = contents.split(",");

            // 将数组内容填充到输入框中
            for (let i = 0; i < Math.min(data_array.length, 10); i++) {
                const inputId = "inputData" + i;
                document.getElementById(inputId).value = data_array[i];
            }
        };

        // 指定文件编码为 UTF-8
        reader.readAsText(file, 'UTF-8');
    }
}
