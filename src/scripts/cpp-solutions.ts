import * as fs from 'fs';
import * as path from 'path';

// Solutions in C++ for each problem
const solutions = {
  'tong-hai-so': `
#include <iostream>
using namespace std;

int main() {
    int T;
    cin >> T;
    
    while (T--) {
        long long a, b;
        cin >> a >> b;
        cout << a + b << endl;
    }
    
    return 0;
}
`,

  'so-fibonacci': `
#include <iostream>
using namespace std;

long long fibonacci(int n) {
    if (n <= 1) return n;
    
    long long a = 0, b = 1;
    for (int i = 2; i <= n; i++) {
        long long temp = a + b;
        a = b;
        b = temp;
    }
    
    return b;
}

int main() {
    int T;
    cin >> T;
    
    while (T--) {
        int n;
        cin >> n;
        cout << fibonacci(n) << endl;
    }
    
    return 0;
}
`,

  'so-nguyen-to': `
#include <iostream>
#include <cmath>
using namespace std;

bool isPrime(long long n) {
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 == 0 || n % 3 == 0) return false;
    
    for (long long i = 5; i * i <= n; i += 6) {
        if (n % i == 0 || n % (i + 2) == 0) {
            return false;
        }
    }
    
    return true;
}

int main() {
    int T;
    cin >> T;
    
    while (T--) {
        long long n;
        cin >> n;
        if (isPrime(n)) {
            cout << "YES" << endl;
        } else {
            cout << "NO" << endl;
        }
    }
    
    return 0;
}
`,

  'dao-nguoc-chuoi': `
#include <iostream>
#include <string>
#include <algorithm>
using namespace std;

int main() {
    int T;
    cin >> T;
    
    while (T--) {
        string s;
        cin >> s;
        reverse(s.begin(), s.end());
        cout << s << endl;
    }
    
    return 0;
}
`,

  'tim-so-lon-nhat': `
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int T;
    cin >> T;
    
    while (T--) {
        int n;
        cin >> n;
        
        vector<int> arr(n);
        for (int i = 0; i < n; i++) {
            cin >> arr[i];
        }
        
        int maxVal = *max_element(arr.begin(), arr.end());
        cout << maxVal << endl;
    }
    
    return 0;
}
`,

  'dem-tan-suat': `
#include <iostream>
#include <map>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    
    vector<int> arr(n);
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }
    
    map<int, int> frequency;
    for (int num : arr) {
        frequency[num]++;
    }
    
    for (const auto& pair : frequency) {
        cout << pair.first << " " << pair.second << endl;
    }
    
    return 0;
}
`,

  'tong-day-con-lien-tiep': `
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int kadane(vector<int>& arr) {
    int max_so_far = arr[0];
    int max_ending_here = arr[0];
    
    for (int i = 1; i < arr.size(); i++) {
        max_ending_here = max(arr[i], max_ending_here + arr[i]);
        max_so_far = max(max_so_far, max_ending_here);
    }
    
    return max_so_far;
}

int main() {
    int T;
    cin >> T;
    
    while (T--) {
        int n;
        cin >> n;
        
        vector<int> arr(n);
        for (int i = 0; i < n; i++) {
            cin >> arr[i];
        }
        
        cout << kadane(arr) << endl;
    }
    
    return 0;
}
`,

  'sap-xep-day-so': `
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int n;
    cin >> n;
    
    vector<int> arr(n);
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }
    
    sort(arr.begin(), arr.end());
    
    for (int i = 0; i < n; i++) {
        cout << arr[i];
        if (i < n - 1) cout << " ";
    }
    cout << endl;
    
    return 0;
}
`,

  'tim-cap-so-tong-bang-x': `
#include <iostream>
#include <vector>
#include <unordered_set>
using namespace std;

bool hasPairWithSum(vector<int>& arr, int x) {
    unordered_set<int> set;
    
    for (int num : arr) {
        if (set.find(x - num) != set.end()) {
            return true;
        }
        set.insert(num);
    }
    
    return false;
}

int main() {
    int T;
    cin >> T;
    
    while (T--) {
        int n, x;
        cin >> n >> x;
        
        vector<int> arr(n);
        for (int i = 0; i < n; i++) {
            cin >> arr[i];
        }
        
        if (hasPairWithSum(arr, x)) {
            cout << "YES" << endl;
        } else {
            cout << "NO" << endl;
        }
    }
    
    return 0;
}
`,

  'duong-di-ngan-nhat-tren-luoi': `
#include <iostream>
#include <vector>
using namespace std;

// Calculate binomial coefficient C(n, k)
long long binomialCoeff(int n, int k) {
    long long res = 1;
    
    // C(n, k) = C(n, n-k)
    if (k > n - k) {
        k = n - k;
    }
    
    // Calculate [n * (n-1) * ... * (n-k+1)] / [k * (k-1) * ... * 1]
    for (int i = 0; i < k; i++) {
        res *= (n - i);
        res /= (i + 1);
    }
    
    return res;
}

int main() {
    int T;
    cin >> T;
    
    while (T--) {
        int n, m;
        cin >> n >> m;
        
        // Number of paths is C(n+m-2, n-1) or C(n+m-2, m-1)
        cout << binomialCoeff(n + m - 2, n - 1) << endl;
    }
    
    return 0;
}
`
};

// Save solutions to files
function saveSolutions() {
  const dirPath = path.join(__dirname, '../../solutions');
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  // Save each solution as a separate file
  for (const [problem, solution] of Object.entries(solutions)) {
    const filePath = path.join(dirPath, `${problem}.cpp`);
    fs.writeFileSync(filePath, solution.trim());
    console.log(`Saved solution for ${problem}`);
  }
  
  console.log('All solutions saved successfully!');
}

// Run the saver
saveSolutions(); 