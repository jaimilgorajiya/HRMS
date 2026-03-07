import bcrypt from "bcryptjs";

async function test() {
    try {
        const password = "password123";
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        console.log("Hash:", hash);
        const match = await bcrypt.compare(password, hash);
        console.log("Match:", match);
    } catch (error) {
        console.error("Error:", error);
    }
}

test();
