async function inputFile(){// 获取元素
    const fileInput = document.getElementById('fileInput');
    const selectedFileName = document.getElementById('selectedFileName');

    // 文件选择事件
    fileInput.addEventListener('change', function() {
        const file = this.files[0]; // 获取选择的文件
        if (file) {
            selectedFileName.textContent = '已选择文件: ' + file.name; // 更新文本内容显示文件名
        } else {
            selectedFileName.textContent = ''; // 如果没有选择文件，则清空文本内容
        }
    });
}


async function readFile() {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    if (file) {
        const fileName = file.name;
        const fileExtension = fileName.split('.').pop().toLowerCase();

        if (fileExtension === 'csv' || fileExtension === 'xlsx') {
            const reader = new FileReader();

            reader.onload = function (e) {
                const contents = e.target.result;
                sendDataToBackend(contents);
            };

            reader.readAsText(file, 'UTF-8');
        } else {
            alert('只允许上传 .csv 或 .xlsx 文件');
        }
    }
}


async function sendDataToBackend(data) {
    try {
        const response = await fetch('/process_data', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: data,
        });

        if (response.ok) {
            const datasetSize = await response.text();
            document.getElementById("datasetSize").innerText = `数据集长度: ${datasetSize}`;
            console.log('Data processed successfully');
        } else {
            console.error('Failed to process data');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}


async function makePrediction() {
    try {
        const predictionResultElement = document.getElementById("predictionResult");
        predictionResultElement.innerText = "正在评级，请稍后...";

        const response = await fetch('/predict', {
            method: 'GET',
        });

        if (response.ok) {
            const result = await response.json();
            const predictionResults = result.results; // 从返回的 JSON 中获取评级结果列表

            // 构建评级结果的字符串，并显示在页面上
            let outputText = "评级结果:\n";
            for (let i = 0; i < predictionResults.length; i++) {
                outputText += predictionResults[i] + "\n";
            }
            predictionResultElement.innerText = outputText;
        } else {
            console.error('Failed to get prediction result');
            predictionResultElement.innerText = "获取评级结果失败";
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById("predictionResult").innerText = "获取评级结果失败";
    }
}


async function selectModel() {
    const modelSelect = document.getElementById("modelSelect");
    const selectedModel = modelSelect.value;

    try {
        const response = await fetch(`/set_model/${selectedModel}`, {
            method: 'GET',
        });

        if (response.ok) {
            console.log('Model selected:', selectedModel);
        } else {
            console.error('Failed to select model');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}