#include <stdio.h>
#include "database.h"

int add(int a, int b) {
    return a + b;
}

void print_result(int value) {
    printf("%d\n", value);
}

int main() {
    int result = add(10, 20);
    print_result(result);
    return 0;
}