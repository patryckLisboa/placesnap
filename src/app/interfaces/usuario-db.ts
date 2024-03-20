export interface UsuarioDb {
    key: string | null;
    email?: string;
    nome_login?: string;
    nome?: string;
    telefone1?: string;
    telefone2?: string;
    nivel_permissao?: number;
    foto_perfil?: string;
    logado?: boolean;
  }
  