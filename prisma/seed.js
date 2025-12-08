"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_1 = require("../src/lib/prisma");
var client_1 = require("../generated/prisma/client");
var faker_1 = require("@faker-js/faker");
var bcryptjs_1 = require("bcryptjs");
var SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Geography', 'Computer Science', 'Economics'];
var LOCATIONS = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'];
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var numOfHardcodedTutors, numOfHardcodedParent, tutors, i, user, _a, _b, parents, students, i, lastName, parent_1, _c, _d, numStudents, j, studentName, student, _e, _f, _i, students_1, student, studentTutors, _g, studentTutors_1, tutorUser, numClasses, k, isPast, date, status_1, cls, context, senderRole, query, numResponses, r;
        var _h, _j, _k, _l, _m, _o;
        return __generator(this, function (_p) {
            switch (_p.label) {
                case 0:
                    console.log('🌱 Starting seeding...');
                    numOfHardcodedTutors = 5;
                    numOfHardcodedParent = 2;
                    console.log("Creating ".concat(numOfHardcodedTutors, " Tutors..."));
                    tutors = [];
                    i = 0;
                    _p.label = 1;
                case 1:
                    if (!(i < numOfHardcodedTutors)) return [3 /*break*/, 5];
                    _b = (_a = prisma_1.default.user).create;
                    _h = {};
                    _j = {
                        fullname: faker_1.faker.person.fullName(), // Fixed: name -> fullname
                        username: faker_1.faker.internet.username().toLowerCase(),
                        email: faker_1.faker.internet.email().toLowerCase()
                    };
                    return [4 /*yield*/, bcryptjs_1.default.hash('password123', 10)];
                case 2: return [4 /*yield*/, _b.apply(_a, [(_h.data = (_j.password = _p.sent(),
                            _j.role = client_1.UserRole.TUTOR,
                            _j.phoneNumber = faker_1.faker.phone.number(),
                            _j.tutorProfile = {
                                create: {
                                    bio: faker_1.faker.lorem.sentences({ min: 2, max: 5 }),
                                    subjects: faker_1.faker.helpers.arrayElements(SUBJECTS, { min: 3, max: 8 }),
                                    hourlyRate: faker_1.faker.number.int({ min: 500, max: 2000, multipleOf: 10 }),
                                    location: faker_1.faker.location.state(),
                                    // location: faker.helpers.arrayElement(LOCATIONS),
                                    isVerified: faker_1.faker.datatype.boolean(0.8),
                                }
                            },
                            _j),
                            _h.include = {
                                tutorProfile: true
                            },
                            _h)])];
                case 3:
                    user = _p.sent();
                    tutors.push(user);
                    _p.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 1];
                case 5:
                    // 2. Create Parents and Students
                    console.log('Creating 50 Parents and their Students...');
                    parents = [];
                    students = [];
                    i = 0;
                    _p.label = 6;
                case 6:
                    if (!(i < numOfHardcodedParent)) return [3 /*break*/, 14];
                    lastName = faker_1.faker.person.lastName();
                    _d = (_c = prisma_1.default.user).create;
                    _k = {};
                    _l = {
                        fullname: faker_1.faker.person.fullName(), // Fixed: name -> fullname
                        username: faker_1.faker.internet.username().toLowerCase(),
                        email: faker_1.faker.internet.email().toLowerCase(),
                        phoneNumber: faker_1.faker.phone.number()
                    };
                    return [4 /*yield*/, bcryptjs_1.default.hash('password123', 10)];
                case 7: return [4 /*yield*/, _d.apply(_c, [(_k.data = (_l.password = _p.sent(),
                            _l.role = client_1.UserRole.PARENT,
                            _l),
                            _k)])];
                case 8:
                    parent_1 = _p.sent();
                    parents.push(parent_1);
                    numStudents = faker_1.faker.number.int({ min: 1, max: 3 });
                    j = 0;
                    _p.label = 9;
                case 9:
                    if (!(j < numStudents)) return [3 /*break*/, 13];
                    studentName = faker_1.faker.person.firstName();
                    _f = (_e = prisma_1.default.student).create;
                    _m = {};
                    _o = {
                        name: "".concat(studentName, " ").concat(lastName),
                        parentId: parent_1.id
                    };
                    return [4 /*yield*/, bcryptjs_1.default.hash('password123', 10)];
                case 10: return [4 /*yield*/, _f.apply(_e, [(_m.data = (_o.password = _p.sent(),
                            _o.age = faker_1.faker.number.int({ min: 6, max: 18 }),
                            _o.school = faker_1.faker.company.name() + ' School',
                            _o.interests = faker_1.faker.helpers.arrayElements(['Sports', 'Music', 'Coding', 'Art', 'Reading'], { min: 1, max: 3 }),
                            _o.aspirations = faker_1.faker.lorem.sentence(),
                            _o),
                            _m)])];
                case 11:
                    student = _p.sent();
                    students.push(student);
                    _p.label = 12;
                case 12:
                    j++;
                    return [3 /*break*/, 9];
                case 13:
                    i++;
                    return [3 /*break*/, 6];
                case 14:
                    // 3. Create Classes, Homework, Reports, Queries
                    console.log('Generating Activities...');
                    _i = 0, students_1 = students;
                    _p.label = 15;
                case 15:
                    if (!(_i < students_1.length)) return [3 /*break*/, 30];
                    student = students_1[_i];
                    studentTutors = faker_1.faker.helpers.arrayElements(tutors, { min: 1, max: 3 });
                    _g = 0, studentTutors_1 = studentTutors;
                    _p.label = 16;
                case 16:
                    if (!(_g < studentTutors_1.length)) return [3 /*break*/, 29];
                    tutorUser = studentTutors_1[_g];
                    if (!tutorUser.tutorProfile)
                        return [3 /*break*/, 28];
                    numClasses = faker_1.faker.number.int({ min: 5, max: 10 });
                    k = 0;
                    _p.label = 17;
                case 17:
                    if (!(k < numClasses)) return [3 /*break*/, 21];
                    isPast = faker_1.faker.datatype.boolean();
                    date = isPast ? faker_1.faker.date.recent({ days: 30 }) : faker_1.faker.date.soon({ days: 30 });
                    status_1 = isPast ? client_1.ClassStatus.COMPLETED : client_1.ClassStatus.SCHEDULED;
                    return [4 /*yield*/, prisma_1.default.class.create({
                            data: {
                                tutorId: tutorUser.tutorProfile.id,
                                studentId: student.id,
                                scheduledAt: date,
                                status: status_1,
                                attendanceToken: status_1 === client_1.ClassStatus.SCHEDULED ? faker_1.faker.string.alphanumeric(6).toUpperCase() : null,
                            }
                        })];
                case 18:
                    cls = _p.sent();
                    if (!(status_1 === client_1.ClassStatus.COMPLETED && faker_1.faker.datatype.boolean(0.7))) return [3 /*break*/, 20];
                    return [4 /*yield*/, prisma_1.default.homework.create({
                            data: {
                                classId: cls.id,
                                studentId: student.id,
                                title: "Homework for ".concat(date.toLocaleDateString()),
                                description: faker_1.faker.lorem.paragraph(),
                                dueDate: faker_1.faker.date.soon({ days: 7, refDate: date }),
                                isCompleted: faker_1.faker.datatype.boolean(0.6),
                            }
                        })];
                case 19:
                    _p.sent();
                    _p.label = 20;
                case 20:
                    k++;
                    return [3 /*break*/, 17];
                case 21:
                    if (!faker_1.faker.datatype.boolean(0.5)) return [3 /*break*/, 23];
                    return [4 /*yield*/, prisma_1.default.report.create({
                            data: {
                                studentId: student.id,
                                title: "Monthly Progress - ".concat(faker_1.faker.date.month()),
                                feedback: faker_1.faker.lorem.paragraph(),
                                grade: faker_1.faker.helpers.arrayElement(['A', 'B', 'A+', 'B+']),
                            }
                        })];
                case 22:
                    _p.sent();
                    _p.label = 23;
                case 23:
                    if (!faker_1.faker.datatype.boolean(0.4)) return [3 /*break*/, 28];
                    context = faker_1.faker.helpers.arrayElement(['TUTOR_PARENT', 'TUTOR_STUDENT']);
                    senderRole = context === 'TUTOR_PARENT' ? faker_1.faker.helpers.arrayElement([client_1.UserRole.PARENT, client_1.UserRole.TUTOR]) : faker_1.faker.helpers.arrayElement([client_1.UserRole.STUDENT, client_1.UserRole.TUTOR]);
                    return [4 /*yield*/, prisma_1.default.query.create({
                            data: {
                                content: faker_1.faker.lorem.sentence(),
                                senderId: senderRole === client_1.UserRole.STUDENT ? student.id : (senderRole === client_1.UserRole.PARENT ? student.parentId : tutorUser.id),
                                senderRole: senderRole,
                                tutorId: tutorUser.tutorProfile.id,
                                studentId: student.id,
                                parentId: student.parentId,
                                context: context,
                            }
                        })];
                case 24:
                    query = _p.sent();
                    numResponses = faker_1.faker.number.int({ min: 1, max: 5 });
                    r = 0;
                    _p.label = 25;
                case 25:
                    if (!(r < numResponses)) return [3 /*break*/, 28];
                    return [4 /*yield*/, prisma_1.default.queryResponse.create({
                            data: {
                                queryId: query.id,
                                content: faker_1.faker.lorem.sentence(),
                                senderId: faker_1.faker.datatype.boolean() ? tutorUser.id : (context === 'TUTOR_PARENT' ? student.parentId : student.id),
                                senderRole: client_1.UserRole.TUTOR, // Simplified
                            }
                        })];
                case 26:
                    _p.sent();
                    _p.label = 27;
                case 27:
                    r++;
                    return [3 /*break*/, 25];
                case 28:
                    _g++;
                    return [3 /*break*/, 16];
                case 29:
                    _i++;
                    return [3 /*break*/, 15];
                case 30:
                    console.log('✅ Seeding completed!');
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error(e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma_1.default.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
