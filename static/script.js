async function readFile() {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const contents = e.target.result;

            // 将文件内容发送到后端处理
            sendDataToBackend(contents);
        };

        reader.readAsText(file, 'UTF-8');
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
        const response = await fetch('/predict', {
            method: 'GET',
        });

        if (response.ok) {
            const result = await response.json();
            document.getElementById("predictionResult").innerText = "Prediction Result: " + result.result;
        } else {
            console.error('Failed to get prediction result');
            document.getElementById("predictionResult").innerText = "Error during prediction";
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById("predictionResult").innerText = "Error during prediction";
    }
}
