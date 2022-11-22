import sys
import hashlib

CHECKSUM = "b39c95752ebdc42402531330af9bcad4"
ENCRYPTED_FLAG = bytes.fromhex("13353508414747461d4c2064696420796f75207265616c6c79207468696e6b20697420776f756c64206265207468697320656173793f")
if __name__ == "__main__":
    input = input("Please enter password:\n")

    if hashlib.md5((input + "+sÄlTy/-.").encode()).hexdigest() != CHECKSUM:
        print("Incorrect password")
        sys.exit(1)

    flag = bytes(a ^ b for (a, b) in zip(input.encode(), ENCRYPTED_FLAG)).decode()
    print(flag)