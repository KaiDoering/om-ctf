#include <stdlib.h>
#include <stdio.h>
#include <string.h>

int main(void) {
    char *greeting = strdup("CTF{5eb63bbbe01eeed093cb22bb8f5acdc3}");
    printf(
        "%c%c%c%c%c %c%c%c%c%c\n",
        greeting[36] - 21,
        greeting[5],
        greeting[29] + 6,
        greeting[12] + 7,
        greeting[7] * 2 + 3,
        greeting[3] - 4,
        greeting[0] | 44,
        greeting[8] * 3 - 39,
        greeting[16] + 7,
        greeting[18]
    );
    free(greeting);
    return 0;
}