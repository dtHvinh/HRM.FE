export const countryCallingCodes = [
    "(+1) ",
    "(+44) ",
    "(+61) ",
    "(+64) ",
    "(+49) ",
    "(+33) ",
    "(+39) ",
    "(+34) ",
    "(+55) ",
    "(+7) ",
    "(+81) ",
    "(+86) ",
    "(+82) ",
    "(+84) ",
    "(+91) ",
    "(+92) ",
    "(+62) ",
    "(+66) ",
    "(+60) ",
    "(+65) ",
    "(+63) ",
    "(+886) ",
    "(+966) ",
    "(+971) ",
    "(+90) ",
    "(+27) "
];

type FormData = {
    fullName: string;
    dob: string;
    gender: 'Male' | 'Female';
    email: string;
    phone: string;
    departmentId: string;
    positionId: string;
    provinceId: string;
    wardId: string;
};

export function generateRandomEmployees(
    provinces: { provinceId: number; provinceName: string }[] = [],
    wards: { wardId: number; wardName: string }[] = [],
    departments: { departmentId: number; name: string }[] = [],
    positions: { positionId: number; name: string }[] = []
): FormData[] {
    const firstNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Vũ', 'Phan', 'Đặng', 'Bùi', 'Đỗ'];
    const middleNames = ['Văn', 'Thị', 'Hữu', 'Đức', 'Ngọc', 'Minh'];
    const lastNames = ['Anh', 'Bình', 'Châu', 'Dũng', 'Hà', 'Hương', 'Khoa', 'Linh', 'My', 'Quân'];

    const genders: ('Male' | 'Female')[] = ['Male', 'Female'];

    const employees: FormData[] = [];

    for (let i = 0; i < 10; i++) {
        const gender = genders[Math.floor(Math.random() * genders.length)];
        const fullName = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${middleNames[Math.floor(Math.random() * middleNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
        const email = `${fullName.toLowerCase().replace(/\s+/g, '.')}@example.com`;

        const phone = `(+84) ${Math.floor(100 + Math.random() * 900)} ${Math.floor(100 + Math.random() * 900)}`;

        const department = departments[Math.floor(Math.random() * departments.length)];
        const position = positions[Math.floor(Math.random() * positions.length)];
        const province = provinces[Math.floor(Math.random() * provinces.length)];
        const ward = wards[Math.floor(Math.random() * wards.length)];

        employees.push({
            fullName,
            dob: '1995-05-31',
            gender,
            email,
            phone,
            departmentId: department?.departmentId.toString() || '',
            positionId: position?.positionId.toString() || '',
            provinceId: province?.provinceId.toString() || '',
            wardId: ward?.wardId.toString() || '',
        });
    }

    return employees;
}