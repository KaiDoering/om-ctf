import sys
import hashlib
import time

CHECKSUM = "b39c95752ebdc42402531330af9bcad4"
PRE = b"Pass"
POST = b"1+s\xc3\x84lTy/-."
chars = list("abcdefghijklmnopqrstuvwxyz01234567890<>()[]\{\}/\\.:,;-_+*#'\"!$%&?=@^~")

if __name__ == "__main__":
    start = time.time()
    for a in chars:
        for b in chars:
            for c in chars:
                for d in chars:
                    for e in chars:
                        cur = PRE + f"{a}{b}{c}{d}{e}".encode() + POST
                        if (hashlib.md5(cur).hexdigest() == CHECKSUM):
                            print("Found: ", cur.decode(), "\n")
                            end = time.time()
                            print("Elapsed time: ", end - start)
                            sys.exit(0)
    print("Not found!")