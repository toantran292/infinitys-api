<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

# Sinh Testcase và Lời Giải cho Bài Tập Lập Trình

Script này sinh ra 20 bộ testcase cho mỗi bài tập lập trình và cung cấp lời giải bằng C++ cho từng bài.

## Cấu trúc thư mục

```
.
├── testcases/                  # Chứa các testcase cho mỗi bài tập
│   ├── tong-hai-so/            # Testcase cho bài tổng hai số
│   │   ├── input1.txt          # File input của testcase 1
│   │   ├── output1.txt         # File output của testcase 1
│   │   └── ...
│   ├── so-fibonacci/           # Testcase cho bài số Fibonacci
│   └── ...
├── solutions/                  # Chứa lời giải C++ cho mỗi bài tập
│   ├── tong-hai-so.cpp         # Lời giải cho bài tổng hai số
│   ├── so-fibonacci.cpp        # Lời giải cho bài số Fibonacci
│   └── ...
└── src/scripts/                # Chứa mã nguồn để sinh testcase và lời giải
    ├── package.json            # File cấu hình npm
    ├── generate-problem-testcases.ts  # Script sinh testcase
    ├── cpp-solutions.ts        # Script lưu trữ lời giải C++
    └── run-generation.ts       # Script chạy cả hai script trên
```

## Cài đặt

1. Di chuyển vào thư mục scripts:

```bash
cd src/scripts
```

2. Cài đặt các dependency:

```bash
npm install
```

## Chạy script sinh testcase và lời giải

```bash
npm run generate
```

Sau khi chạy script, các testcase và lời giải sẽ được tạo trong thư mục `testcases` và `solutions`.

## Danh sách bài tập

1. **tong-hai-so**: Tổng hai số nguyên a và b
2. **so-fibonacci**: Tính số Fibonacci thứ n
3. **so-nguyen-to**: Kiểm tra số nguyên tố
4. **dao-nguoc-chuoi**: Đảo ngược chuỗi
5. **tim-so-lon-nhat**: Tìm số lớn nhất trong dãy
6. **dem-tan-suat**: Đếm tần suất xuất hiện của phần tử trong dãy
7. **tong-day-con-lien-tiep**: Tìm tổng dãy con liên tiếp lớn nhất
8. **sap-xep-day-so**: Sắp xếp dãy số
9. **tim-cap-so-tong-bang-x**: Tìm cặp số có tổng bằng X
10. **duong-di-ngan-nhat-tren-luoi**: Đếm số đường đi ngắn nhất trên lưới

## Lời giải C++

Các lời giải C++ đã được tối ưu và viết đầy đủ cho mỗi bài tập. Bạn có thể sử dụng các lời giải này để tham khảo hoặc để kiểm tra độ chính xác của các testcase.

Để biên dịch và chạy một lời giải:

```bash
g++ -std=c++14 solutions/tong-hai-so.cpp -o solution
./solution < testcases/tong-hai-so/input1.txt
```

Kết quả sẽ hiển thị trên terminal và bạn có thể so sánh với nội dung trong file output1.txt.
