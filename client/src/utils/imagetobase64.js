export default function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = function (e) {
            const base64String = e.target.result;
            resolve(base64String); // Return the Base64 string
        };

        reader.onerror = function (error) {
            reject(error); // Return the error
        };

        reader.readAsDataURL(file); // Read and convert to Base64
    });
}
