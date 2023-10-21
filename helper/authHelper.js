import bcrypt from 'bcrypt';

export const hashPassword = async (password) => {
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        
    }
};


export const comparePassword = async(password,hashPassword)=>{
    return bcrypt.compare(password,hashPassword);
};


// import bcrypt from 'bcrypt';

// export const hashPassword = async (password) => {
//     try {
//         const saltRounds = 10;
//         const hashedPassword = await bcrypt.hash(password, saltRounds);
//         return hashedPassword;
//     } catch (error) {
//         
//     }
// };

// export const comparePassword = async (password, hashedPassword) => {
//     try {
//         const isMatch = await bcrypt.compare(password, hashedPassword);
//         return isMatch;
//     } catch (error) {
//         
//     }
// };



