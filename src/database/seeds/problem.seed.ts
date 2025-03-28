import { DataSource } from 'typeorm';

import { Problem, ProblemDifficulty } from '../../modules/problems/entities/problem.entity';
import { Page } from '../../modules/pages/entities/page.entity';

export const problemSeed = async (dataSource: DataSource) => {
  const problemRepository = dataSource.getRepository(Problem);
  const pageRepository = dataSource.getRepository(Page);

  // Find a page to associate problems with
  const page = await pageRepository.findOne({
    where: { name: 'Tech Community' },
  });

  const problems = [
    {
      title: 'Tổng hai số',
      content: `
Cho hai số nguyên a và b, tính tổng của chúng.

**Input:**
- Dòng đầu tiên chứa số nguyên T (1 ≤ T ≤ 100) - số lượng test case.
- T dòng tiếp theo, mỗi dòng chứa hai số nguyên a và b (1 ≤ a, b ≤ 10^9).

**Output:**
- Với mỗi test case, in ra một dòng chứa tổng của a và b.
      `,
      difficulty: ProblemDifficulty.Easy,
      timeLimit: 1000,
      memoryLimit: 262144,
      examples: [
        {
          input: `1 2`,
          output: `3`,
          explanation: "Tổng của 1 và 2 là 3"
        },
        {
          input: `5 7`,
          output: `12`,
          explanation: "Tổng của 5 và 7 là 12"
        },
        {
          input: `10 20`,
          output: `30`,
          explanation: "Tổng của 10 và 20 là 30"
        }
      ],
      constraints: [
        "1 ≤ T ≤ 100",
        "1 ≤ a, b ≤ 10^9",
        "Thời gian thực thi của mỗi testcase phải là O(1)",
        "Không gian bộ nhớ của mỗi testcase phải là O(1)"
      ]
    },
    {
      title: 'Số Fibonacci',
      content: `
Dãy Fibonacci được định nghĩa như sau: F(0) = 0, F(1) = 1, và F(n) = F(n-1) + F(n-2) với n ≥ 2.

Cho một số nguyên n, hãy tính F(n).

**Input:**
- Dòng đầu tiên chứa số nguyên T (1 ≤ T ≤ 100) - số lượng test case.
- T dòng tiếp theo, mỗi dòng chứa một số nguyên n (0 ≤ n ≤ 45).

**Output:**
- Với mỗi test case, in ra một dòng chứa F(n).
      `,
      difficulty: ProblemDifficulty.Easy,
      timeLimit: 1000,
      memoryLimit: 262144,
      examples: [
        {
          input: `0`,
          output: `0`,
          explanation: "F(0) = 0 theo định nghĩa"
        },
        {
          input: `1`,
          output: `1`,
          explanation: "F(1) = 1 theo định nghĩa"
        },
        {
          input: `5`,
          output: `5`,
          explanation: "F(5) = F(4) + F(3) = 3 + 2 = 5"
        },
        {
          input: `10`,
          output: `55`,
          explanation: "F(10) = 55 theo dãy Fibonacci"
        }
      ],
      constraints: [
        "1 ≤ T ≤ 100",
        "0 ≤ n ≤ 45",
        "Thời gian thực thi của mỗi testcase phải là O(n)",
        "Không gian bộ nhớ của mỗi testcase phải là O(1)"
      ]
    },
    {
      title: 'Số nguyên tố',
      content: `
Một số nguyên dương lớn hơn 1 được gọi là số nguyên tố nếu nó chỉ chia hết cho 1 và chính nó.

Cho một số nguyên n, hãy kiểm tra xem n có phải là số nguyên tố hay không.

**Input:**
- Dòng đầu tiên chứa số nguyên T (1 ≤ T ≤ 100) - số lượng test case.
- T dòng tiếp theo, mỗi dòng chứa một số nguyên n (2 ≤ n ≤ 10^9).

**Output:**
- Với mỗi test case, in ra "YES" nếu n là số nguyên tố, ngược lại in ra "NO".
      `,
      difficulty: ProblemDifficulty.Easy,
      timeLimit: 1000,
      memoryLimit: 262144,
      examples: [
        {
          input: `2`,
          output: `YES`,
          explanation: "2 chỉ chia hết cho 1 và chính nó nên là số nguyên tố"
        },
        {
          input: `4`,
          output: `NO`,
          explanation: "4 chia hết cho 1, 2 và 4 nên không phải số nguyên tố"
        },
        {
          input: `17`,
          output: `YES`,
          explanation: "17 chỉ chia hết cho 1 và chính nó nên là số nguyên tố"
        }
      ],
      constraints: [
        "1 ≤ T ≤ 100",
        "2 ≤ n ≤ 10^9",
        "Thời gian thực thi của mỗi testcase phải là O(sqrt(n))",
        "Không gian bộ nhớ của mỗi testcase phải là O(1)"
      ]
    },
    {
      title: 'Đảo ngược chuỗi',
      content: `
Cho một chuỗi s, hãy đảo ngược chuỗi đó.

**Input:**
- Dòng đầu tiên chứa số nguyên T (1 ≤ T ≤ 100) - số lượng test case.
- T dòng tiếp theo, mỗi dòng chứa một chuỗi s (1 ≤ |s| ≤ 100) chỉ gồm các chữ cái tiếng Anh và chữ số.

**Output:**
- Với mỗi test case, in ra một dòng chứa chuỗi s sau khi đảo ngược.
      `,
      difficulty: ProblemDifficulty.Easy,
      timeLimit: 1000,
      memoryLimit: 262144,
      examples: [
        {
          input: `hello`,
          output: `olleh`,
          explanation: "Đảo ngược chuỗi 'hello' ta được 'olleh'"
        },
        {
          input: `algorithm`,
          output: `mhtirogla`,
          explanation: "Đảo ngược chuỗi 'algorithm' ta được 'mhtirogla'"
        }
      ],
      constraints: [
        "1 ≤ T ≤ 100",
        "1 ≤ |s| ≤ 100",
        "s chỉ chứa các chữ cái tiếng Anh và chữ số",
        "Thời gian thực thi của mỗi testcase phải là O(n)",
        "Không gian bộ nhớ của mỗi testcase phải là O(n)"
      ]
    },
    {
      title: 'Tìm số lớn nhất',
      content: `
Cho một dãy số, hãy tìm số lớn nhất trong dãy.

**Input:**
- Dòng đầu tiên chứa số nguyên T (1 ≤ T ≤ 100) - số lượng test case.
- Với mỗi test case:
  - Dòng đầu tiên chứa số nguyên n (1 ≤ n ≤ 10^5) - số lượng phần tử trong dãy.
  - Dòng thứ hai chứa n số nguyên a_1, a_2, ..., a_n (-10^9 ≤ a_i ≤ 10^9).

**Output:**
- Với mỗi test case, in ra một dòng chứa số lớn nhất trong dãy.
      `,
      difficulty: ProblemDifficulty.Easy,
      timeLimit: 1000,
      memoryLimit: 262144,
      examples: [
        {
          input: `5
1 2 3 4 5`,
          output: `5`,
          explanation: "Số lớn nhất trong dãy [1, 2, 3, 4, 5] là 5"
        },
        {
          input: `4
-1 -5 -10 -2`,
          output: `-1`,
          explanation: "Số lớn nhất trong dãy [-1, -5, -10, -2] là -1"
        }
      ],
      constraints: [
        "1 ≤ T ≤ 100", 
        "1 ≤ n ≤ 10^5",
        "-10^9 ≤ a_i ≤ 10^9",
        "Thời gian thực thi của mỗi testcase phải là O(n)",
        "Không gian bộ nhớ của mỗi testcase phải là O(1)"
      ]
    },
    {
      title: 'Đếm tần suất xuất hiện',
      content: `
Cho một dãy số, hãy đếm tần suất xuất hiện của mỗi phần tử trong dãy.

**Input:**
- Dòng đầu tiên chứa số nguyên n (1 ≤ n ≤ 10^5) - số lượng phần tử trong dãy.
- Dòng thứ hai chứa n số nguyên a_1, a_2, ..., a_n (1 ≤ a_i ≤ 10^5).

**Output:**
- In ra q dòng, mỗi dòng gồm hai số nguyên x và f, trong đó x là phần tử xuất hiện trong dãy và f là tần suất xuất hiện của x. Các dòng được sắp xếp tăng dần theo giá trị của x.
      `,
      difficulty: ProblemDifficulty.Medium,
      timeLimit: 1000,
      memoryLimit: 262144,
      examples: [
        {
          input: `6
1 2 1 3 2 1`,
          output: `1 3
2 2
3 1`,
          explanation: "Số 1 xuất hiện 3 lần, số 2 xuất hiện 2 lần, số 3 xuất hiện 1 lần"
        }
      ],
      constraints: [
        "1 ≤ n ≤ 10^5",
        "1 ≤ a_i ≤ 10^5",
        "Thời gian thực thi phải là O(n)",
        "Không gian bộ nhớ phải là O(n)"
      ]
    },
    {
      title: 'Tổng dãy con liên tiếp lớn nhất',
      content: `
Cho một dãy số nguyên, hãy tìm tổng lớn nhất của một dãy con liên tiếp.

**Input:**
- Dòng đầu tiên chứa số nguyên T (1 ≤ T ≤ 100) - số lượng test case.
- Với mỗi test case:
  - Dòng đầu tiên chứa số nguyên n (1 ≤ n ≤ 10^5) - số lượng phần tử trong dãy.
  - Dòng thứ hai chứa n số nguyên a_1, a_2, ..., a_n (-10^4 ≤ a_i ≤ 10^4).

**Output:**
- Với mỗi test case, in ra một dòng chứa tổng lớn nhất của một dãy con liên tiếp.
      `,
      difficulty: ProblemDifficulty.Medium,
      timeLimit: 1000,
      memoryLimit: 262144,
      examples: [
        {
          input: `5
-2 1 -3 4 -1`,
          output: `4`,
          explanation: "Dãy con có tổng lớn nhất là [4] với tổng là 4"
        },
        {
          input: `4
5 4 -1 7`,
          output: `15`,
          explanation: "Dãy con có tổng lớn nhất là [5, 4, -1, 7] với tổng là 15"
        }
      ],
      constraints: [
        "1 ≤ T ≤ 100",
        "1 ≤ n ≤ 10^5",
        "-10^4 ≤ a_i ≤ 10^4",
        "Thời gian thực thi của mỗi testcase phải là O(n)",
        "Không gian bộ nhớ của mỗi testcase phải là O(1)"
      ]
    },
    {
      title: 'Sắp xếp dãy số',
      content: `
Cho một dãy số nguyên, hãy sắp xếp dãy theo thứ tự tăng dần.

**Input:**
- Dòng đầu tiên chứa số nguyên n (1 ≤ n ≤ 10^5) - số lượng phần tử trong dãy.
- Dòng thứ hai chứa n số nguyên a_1, a_2, ..., a_n (-10^9 ≤ a_i ≤ 10^9).

**Output:**
- In ra một dòng chứa n số nguyên - dãy số sau khi đã sắp xếp.
      `,
      difficulty: ProblemDifficulty.Medium,
      timeLimit: 1000,
      memoryLimit: 262144,
      examples: [
        {
          input: `5
5 2 3 1 4`,
          output: `1 2 3 4 5`,
          explanation: "Sắp xếp dãy [5, 2, 3, 1, 4] theo thứ tự tăng dần ta được [1, 2, 3, 4, 5]"
        }
      ],
      constraints: [
        "1 ≤ n ≤ 10^5",
        "-10^9 ≤ a_i ≤ 10^9",
        "Thời gian thực thi phải là O(n log n)",
        "Không gian bộ nhớ phải là O(n)"
      ]
    },
    {
      title: 'Tìm cặp số có tổng bằng X',
      content: `
Cho một dãy số nguyên và một số nguyên X, hãy tìm hai phần tử trong dãy có tổng bằng X.

**Input:**
- Dòng đầu tiên chứa số nguyên T (1 ≤ T ≤ 100) - số lượng test case.
- Với mỗi test case:
  - Dòng đầu tiên chứa hai số nguyên n và X (1 ≤ n ≤ 10^5, -10^9 ≤ X ≤ 10^9) - số lượng phần tử trong dãy và tổng cần tìm.
  - Dòng thứ hai chứa n số nguyên a_1, a_2, ..., a_n (-10^9 ≤ a_i ≤ 10^9).

**Output:**
- Với mỗi test case, in ra một dòng:
  - Nếu tồn tại hai phần tử có tổng bằng X, in ra "YES"
  - Ngược lại, in ra "NO"
      `,
      difficulty: ProblemDifficulty.Medium,
      timeLimit: 1000,
      memoryLimit: 262144,
      examples: [
        {
          input: `5 9
1 2 3 4 5`,
          output: `YES`,
          explanation: "Có cặp số (4, 5) có tổng bằng 9"
        },
        {
          input: `5 20
1 2 3 4 5`,
          output: `NO`,
          explanation: "Không có cặp số nào có tổng bằng 20"
        }
      ],
      constraints: [
        "1 ≤ T ≤ 100",
        "1 ≤ n ≤ 10^5",
        "-10^9 ≤ X, a_i ≤ 10^9",
        "Thời gian thực thi của mỗi testcase phải là O(n)",
        "Không gian bộ nhớ của mỗi testcase phải là O(n)"
      ]
    },
    {
      title: 'Đường đi ngắn nhất trên lưới',
      content: `
Cho một lưới có kích thước n×m. Bạn xuất phát từ ô (1,1) và muốn đi đến ô (n,m). Mỗi bước, bạn chỉ được đi sang phải hoặc đi xuống dưới.

Hãy tính số đường đi khác nhau từ (1,1) đến (n,m).

**Input:**
- Dòng đầu tiên chứa số nguyên T (1 ≤ T ≤ 100) - số lượng test case.
- T dòng tiếp theo, mỗi dòng chứa hai số nguyên n và m (1 ≤ n, m ≤ 20).

**Output:**
- Với mỗi test case, in ra một dòng chứa số đường đi khác nhau từ (1,1) đến (n,m).
      `,
      difficulty: ProblemDifficulty.Hard,
      timeLimit: 1000,
      memoryLimit: 262144,
      examples: [
        {
          input: `2 2`,
          output: `2`,
          explanation: "Có 2 đường đi: (1,1)->(1,2)->(2,2) và (1,1)->(2,1)->(2,2)"
        },
        {
          input: `2 3`,
          output: `3`,
          explanation: "Có 3 đường đi khác nhau"
        },
        {
          input: `3 3`,
          output: `6`,
          explanation: "Có 6 đường đi khác nhau"
        }
      ],
      constraints: [
        "1 ≤ T ≤ 100",
        "1 ≤ n, m ≤ 20",
        "Thời gian thực thi của mỗi testcase phải là O(n*m)",
        "Không gian bộ nhớ của mỗi testcase phải là O(n*m)"
      ]
    }
  ];

  for (const problemData of problems) {
    const existingProblem = await problemRepository.findOne({
      where: { title: problemData.title },
    });

    if (!existingProblem) {
      const problem = problemRepository.create({
        ...problemData,
        page: page || undefined,
      });
      
      await problemRepository.save(problem);
      console.log(`Created problem: ${problemData.title}`);
    } else {
      console.log(`Problem already exists: ${problemData.title}`);
    }
  }

  console.log('Problem seed completed');
}; 