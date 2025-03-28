const fs = require('fs');
const path = require('path');

// Thư mục lưu trữ tất cả các testcase
const baseDir = path.join(__dirname, 'testcases');

// Hàm sinh số ngẫu nhiên trong khoảng [min, max]
const randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Hàm sinh chuỗi ngẫu nhiên có độ dài length
const randomString = (length) => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

// Hàm kiểm tra số nguyên tố
const isPrime = (n) => {
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 === 0 || n % 3 === 0) return false;
    for (let i = 5; i * i <= n; i += 6) {
        if (n % i === 0 || n % (i + 2) === 0) return false;
    }
    return true;
};

// Hàm sinh testcase cho mỗi bài toán
const generateTestcase = (problem, problemIndex) => {
    const problemDir = path.join(baseDir, `problem_${problemIndex + 1}_${problem.title.replace(/\s+/g, '_')}`);
    if (!fs.existsSync(problemDir)) {
        fs.mkdirSync(problemDir, { recursive: true });
    }

    for (let i = 1; i <= 30; i++) {
        let inputContent = '';
        let outputContent = '';

        switch (problem.title) {
            case 'Tổng hai số':
                const T1 = randomInt(1, 100);
                inputContent += `${T1}\n`;
                for (let j = 0; j < T1; j++) {
                    const a = randomInt(1, 1e9);
                    const b = randomInt(1, 1e9);
                    inputContent += `${a} ${b}\n`;
                    outputContent += `${a + b}\n`;
                }
                break;

            case 'Số Fibonacci':
                const T2 = randomInt(1, 100);
                inputContent += `${T2}\n`;
                for (let j = 0; j < T2; j++) {
                    const n = randomInt(0, 45);
                    inputContent += `${n}\n`;

                    // Tính Fibonacci
                    let fib = [0, 1];
                    for (let k = 2; k <= n; k++) {
                        fib[k] = fib[k - 1] + fib[k - 2];
                    }
                    outputContent += `${fib[n]}\n`;
                }
                break;

            case 'Số nguyên tố':
                const T3 = randomInt(1, 100);
                inputContent += `${T3}\n`;
                for (let j = 0; j < T3; j++) {
                    const n = randomInt(2, 1e6);
                    inputContent += `${n}\n`;
                    outputContent += isPrime(n) ? 'YES\n' : 'NO\n';
                }
                break;

            case 'Đảo ngược chuỗi':
                const T4 = randomInt(1, 100);
                inputContent += `${T4}\n`;
                for (let j = 0; j < T4; j++) {
                    const s = randomString(randomInt(1, 100));
                    inputContent += `${s}\n`;
                    outputContent += `${s.split('').reverse().join('')}\n`;
                }
                break;

            case 'Tìm số lớn nhất':
                const T5 = randomInt(1, 100);
                inputContent += `${T5}\n`;
                for (let j = 0; j < T5; j++) {
                    const n = randomInt(1, 1000);
                    const arr = Array.from({ length: n }, () => randomInt(-1e9, 1e9));
                    inputContent += `${n}\n${arr.join(' ')}\n`;
                    outputContent += `${Math.max(...arr)}\n`;
                }
                break;

            default:
                inputContent = `1\n1\n`;
                outputContent = `1\n`;
                break;
        }

        // Tạo file .in và .out
        fs.writeFileSync(path.join(problemDir, `${i}.in`), inputContent.trim());
        fs.writeFileSync(path.join(problemDir, `${i}.out`), outputContent.trim());
    }

    console.log(`✅ 30 testcases cho "${problem.title}" đã được tạo thành công.`);
};

// Mảng bài toán
const problems = [
    {
        title: 'Tổng hai số',
        difficulty: 'Easy',
    },
    {
        title: 'Số Fibonacci',
        difficulty: 'Easy',
    },
    {
        title: 'Số nguyên tố',
        difficulty: 'Easy',
    },
    {
        title: 'Đảo ngược chuỗi',
        difficulty: 'Easy',
    },
    {
        title: 'Tìm số lớn nhất',
        difficulty: 'Easy',
    }
];

// Tạo thư mục testcases nếu chưa có
if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir);
}

// Sinh testcase cho từng bài toán
problems.forEach((problem, index) => {
    generateTestcase(problem, index);
});

console.log('🎉 Tất cả các bài toán đã được tạo testcase thành công!');