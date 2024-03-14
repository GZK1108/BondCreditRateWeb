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
            document.getElementById("datasetSize").innerText = `Dataset Size: ${datasetSize}`;
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
            predictionResultElement.innerText = "评级结果: " + result.result;
        } else {
            console.error('Failed to get prediction result');
            predictionResultElement.innerText = "获取评级结果失败";
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById("predictionResult").innerText = "获取评级结果失败";
    }
}

