import { PrismaService } from '../prisma/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
export declare class EmployeesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(search?: string, departmentId?: string, status?: string): Promise<({
        manager: {
            id: string;
            employeeCode: string;
            firstName: string;
            lastName: string;
        };
        department: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            parentId: string | null;
            managerId: string | null;
        };
        position: {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            title: string;
            baseSalaryMin: number;
            baseSalaryMax: number;
            departmentId: string | null;
        };
        user: {
            id: string;
            role: {
                id: string;
                name: import(".prisma/client").$Enums.RoleEnum;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
            };
            email: string;
            isActive: boolean;
        };
        profile: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            bio: string | null;
            avatar: string | null;
            emergencyContactName: string | null;
            emergencyContactPhone: string | null;
            maritalStatus: string | null;
            education: string | null;
            employeeId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        managerId: string | null;
        departmentId: string | null;
        employeeCode: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string | null;
        gender: string | null;
        dob: Date | null;
        address: string | null;
        nationalId: string | null;
        taxId: string | null;
        bankAccount: string | null;
        bankName: string | null;
        hireDate: Date;
        status: import(".prisma/client").$Enums.EmploymentStatus;
        positionId: string | null;
    })[]>;
    findOne(id: string): Promise<{
        manager: {
            id: string;
            employeeCode: string;
            firstName: string;
            lastName: string;
        };
        department: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            parentId: string | null;
            managerId: string | null;
        };
        position: {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            title: string;
            baseSalaryMin: number;
            baseSalaryMax: number;
            departmentId: string | null;
        };
        subordinates: {
            id: string;
            position: {
                id: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                code: string;
                title: string;
                baseSalaryMin: number;
                baseSalaryMax: number;
                departmentId: string | null;
            };
            employeeCode: string;
            firstName: string;
            lastName: string;
        }[];
        user: {
            id: string;
            role: {
                id: string;
                name: import(".prisma/client").$Enums.RoleEnum;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
            };
            email: string;
            isActive: boolean;
        };
        profile: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            bio: string | null;
            avatar: string | null;
            emergencyContactName: string | null;
            emergencyContactPhone: string | null;
            maritalStatus: string | null;
            education: string | null;
            employeeId: string;
        };
        documents: {
            id: string;
            title: string;
            employeeId: string;
            documentType: string;
            fileUrl: string;
            uploadedAt: Date;
        }[];
        contracts: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            employeeId: string;
            contractNumber: string;
            contractType: import(".prisma/client").$Enums.ContractType;
            startDate: Date;
            endDate: Date | null;
            salary: number;
            documentUrl: string | null;
        }[];
        leaveBalances: ({
            leaveType: {
                id: string;
                name: string;
                description: string | null;
                createdAt: Date;
                code: string;
                maxDaysPerYear: number;
                isPaid: boolean;
                requiresApproval: boolean;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            employeeId: string;
            year: number;
            allocatedDays: number;
            usedDays: number;
            pendingDays: number;
            remainingDays: number;
            leaveTypeId: string;
        })[];
        salaryStructure: {
            components: {
                id: string;
                type: string;
                componentName: string;
                amount: number;
                isTaxable: boolean;
                isInsuranceable: boolean;
                structureId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            employeeId: string;
            baseSalary: number;
            effectiveDate: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        managerId: string | null;
        departmentId: string | null;
        employeeCode: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string | null;
        gender: string | null;
        dob: Date | null;
        address: string | null;
        nationalId: string | null;
        taxId: string | null;
        bankAccount: string | null;
        bankName: string | null;
        hireDate: Date;
        status: import(".prisma/client").$Enums.EmploymentStatus;
        positionId: string | null;
    }>;
    create(createDto: CreateEmployeeDto): Promise<{
        department: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            parentId: string | null;
            managerId: string | null;
        };
        position: {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            title: string;
            baseSalaryMin: number;
            baseSalaryMax: number;
            departmentId: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        managerId: string | null;
        departmentId: string | null;
        employeeCode: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string | null;
        gender: string | null;
        dob: Date | null;
        address: string | null;
        nationalId: string | null;
        taxId: string | null;
        bankAccount: string | null;
        bankName: string | null;
        hireDate: Date;
        status: import(".prisma/client").$Enums.EmploymentStatus;
        positionId: string | null;
    }>;
    update(id: string, updateDto: UpdateEmployeeDto): Promise<{
        manager: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            managerId: string | null;
            departmentId: string | null;
            employeeCode: string;
            firstName: string;
            lastName: string;
            email: string;
            phone: string | null;
            gender: string | null;
            dob: Date | null;
            address: string | null;
            nationalId: string | null;
            taxId: string | null;
            bankAccount: string | null;
            bankName: string | null;
            hireDate: Date;
            status: import(".prisma/client").$Enums.EmploymentStatus;
            positionId: string | null;
        };
        department: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            parentId: string | null;
            managerId: string | null;
        };
        position: {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            title: string;
            baseSalaryMin: number;
            baseSalaryMax: number;
            departmentId: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        managerId: string | null;
        departmentId: string | null;
        employeeCode: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string | null;
        gender: string | null;
        dob: Date | null;
        address: string | null;
        nationalId: string | null;
        taxId: string | null;
        bankAccount: string | null;
        bankName: string | null;
        hireDate: Date;
        status: import(".prisma/client").$Enums.EmploymentStatus;
        positionId: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        managerId: string | null;
        departmentId: string | null;
        employeeCode: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string | null;
        gender: string | null;
        dob: Date | null;
        address: string | null;
        nationalId: string | null;
        taxId: string | null;
        bankAccount: string | null;
        bankName: string | null;
        hireDate: Date;
        status: import(".prisma/client").$Enums.EmploymentStatus;
        positionId: string | null;
    }>;
    addDocument(employeeId: string, docData: {
        title: string;
        documentType: string;
        fileUrl: string;
    }): Promise<{
        id: string;
        title: string;
        employeeId: string;
        documentType: string;
        fileUrl: string;
        uploadedAt: Date;
    }>;
    addContract(employeeId: string, contractData: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        employeeId: string;
        contractNumber: string;
        contractType: import(".prisma/client").$Enums.ContractType;
        startDate: Date;
        endDate: Date | null;
        salary: number;
        documentUrl: string | null;
    }>;
}
