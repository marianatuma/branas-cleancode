import CPF from '../../src/domain/CPF';

test.each(['97456321558', '71428793860', '87748248800'])(
    'Deve testar se o cpf é válido: %s',
    function (cpf: string) {
        const newCpf = new CPF(cpf);
        expect(newCpf.getValue()).toBeDefined();
        expect(newCpf.getValue()).toBe(cpf);
    }
);

test.each(['8774824880', null, undefined, '11111111111'])(
    'Deve testar se o cpf é inválido: %s',
    function (cpf: any) {
        expect(() => new CPF(cpf)).toThrow(new Error('Invalid cpf'));
    }
);
