import { Injectable } from '@angular/core';
import { Subscription, firstValueFrom } from 'rxjs';
import { AuthService } from '../../../services/auth/auth.service';
import { CompraDb } from '../../../interfaces/compra-db';
import { UsuariodbService } from '../../../services/usuariodb/usuariodb.service';
import { CompradbService } from '../../../services/compradb/compradb.service';
import { UsuarioDb } from '../../../interfaces/usuario-db';
import { PMessageService } from '../../../shared/components/p-message/p-message.service';
import { ConteudodbService } from '../../../services/conteudodb/conteudodb.service';
import { ConteudoDb } from '../../../interfaces/conteudo-db';
import { PaymentService } from './payment.service';
import { ConteudocompradbService } from '../../../services/conteudocompradb/conteudocompradb.service';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  usuarioEstaLogado = false;
  userAuth: any;
  userAuthSubscription: Subscription | undefined;
  compras: CompraDb[] = [];
  comprasSubscription: Subscription | undefined;
  conteudos: ConteudoDb[] = [];
  conteudosSubscription: Subscription | undefined;
  usuarios: UsuarioDb[] = [];
  usuarioSubscription: Subscription | undefined;
  permissaoUsuario = 0;
  creatorContent: any = null;

  constructor(
    public authService: AuthService,
    public conteudoDbService: ConteudodbService,
    public compraDbService: CompradbService,
    public usuariosDbService: UsuariodbService,
    public paymentService: PaymentService,
    public messageService: PMessageService,
    public conteudocompradbService: ConteudocompradbService
  ) {}

  onInit() {
    this.userAuthSubscription = this.authService.user.subscribe((user) => {
      this.userAuth = user;
      if (this.userAuth) {
        this.usuarioSubscription = this.usuariosDbService
          .getUsuarioObservableById(this.userAuth.uid)
          .valueChanges()
          .subscribe((usuario: UsuarioDb | null) => {
            if (usuario) {
              if (this.usuarioEstaLogado != usuario.logado) {
                if (usuario && !usuario.logado) {
                  this.logOut();
                }
                this.usuarioEstaLogado = Boolean(usuario.logado);
              }
              if (this.usuarioEstaLogado) {
                this.permissaoUsuario = usuario.nivel_permissao || 0;
                if (usuario.nivel_permissao == 1) {
                  this.userPageInit(this.paymentService.placerKey)
                  this.conteudos = [];
                  if (this.paymentService.placerKey) {
                    this.consultarConteudos(this.paymentService.placerKey);
                    this.consultarCompras();
                  }
                } else if (usuario.nivel_permissao == 2) {
                  this.userPageInit(user.uid)
                  this.conteudos = [];
                  this.consultarConteudos(user.uid);
                }
              }
            }
          });
      }else{
        this.userPageFinalize();
      }
    });
  }

  onDestroy(): void {
    if (this.userAuthSubscription) {
      this.userAuthSubscription.unsubscribe();
    }
    if (this.comprasSubscription) {
      this.comprasSubscription.unsubscribe();
    }
    if (this.conteudosSubscription) {
      this.conteudosSubscription.unsubscribe();
    }
    if (this.usuarioSubscription) {
      this.usuarioSubscription.unsubscribe();
    }
  }

  async userPageInit(userId: string){
    const placer = await firstValueFrom(
      this.usuariosDbService.getUsuarioById(userId)
    );
    if(placer){
      this.creatorContent = placer;
    }
  }

  userPageFinalize(){
    this.compras = [];
    this.conteudos = [];
    this.usuarios = [];
    this.creatorContent = [];
  }

  consultarCompras() {
    this.comprasSubscription = this.compraDbService
      .getCompras(this.userAuth?.uid)
      .subscribe((compras: CompraDb[]) => {
        this.compras = compras;
      });
  }

  consultarConteudos(usuario: string) {
    this.conteudosSubscription = this.conteudoDbService
      .getConteudos(usuario)
      .subscribe((conteudos: ConteudoDb[]) => {
        this.conteudos = conteudos;
      });
  }

  consultarUsuarios() {
    // this.usuarioSubscription = this.usuariosDbService
    //   .getUsuarios(this.userAuth?.uid)
    //   .subscribe((usuarios: UsuarioDb[]) => {
    //     this.usuarios = usuarios;
    //   });
  }

  async emailSignin(emailFormControl: string, passwordFormControl: string) {
    await this.authService.emailSignin(emailFormControl, passwordFormControl);
    await this.handleAcessoUsuario(true);
  }

  async handleAcessoUsuario(loginValidation = false) {
    if (this.userAuth) {
      const usuario = await firstValueFrom(
        this.usuariosDbService.getUsuarioById(this.userAuth.uid)
      );
      if (usuario && usuario.logado) {
        await this.usuariosDbService.updateUsuario(this.userAuth.uid, {
          ...usuario,
          logado: false,
        });
        if (loginValidation) {
          return this.messageService.showErrorMessage(
            'Desconectando usuário logado em outra máquina... Faça login novamente'
          );
        }
      }
    }
    if (loginValidation) {
      await this.addCurrentUsuarioToDataBase();
    }else{
      this.userPageFinalize();
    }
  }

  async emailSignup(emailFormControl: string, passwordFormControl: string) {
    await this.authService.emailSignup(emailFormControl, passwordFormControl);
    await this.addCurrentUsuarioToDataBase();
  }

  async addCurrentUsuarioToDataBase() {
    if (this.userAuth) {
      const usuario = await firstValueFrom(
        this.usuariosDbService.getUsuarioById(this.userAuth.uid)
      );
      if (!usuario) {
        await this.usuariosDbService.addUsuario({
          key: this.userAuth.uid,
          email: this.userAuth.email,
          nivel_permissao: 1,
          logado: true,
        });
      } else {
        await this.usuariosDbService.updateUsuario(this.userAuth.uid, {
          ...usuario,
          logado: true,
        });
      }
      this.usuarioEstaLogado = true;
    }
  }

  async googleSignin() {
    await this.authService.googleSignin();
    await this.handleAcessoUsuario(true);
  }

  async addCompra(conteudoKey: string) {
    this.paymentService.comprar(conteudoKey, this.userAuth.uid);
  }

  removeCompra(key: string) {
    this.paymentService.cancelarCompra(key);
  }

  addConteudo(key: string, contentParams: ConteudoDb) {
    if (key) {
      this.conteudoDbService.updateConteudo(key, {
        ...contentParams,
        usuarioKey: this.userAuth.uid,
      } as ConteudoDb);
      return 
    }
    this.conteudoDbService.addConteudo({
      ...contentParams,
      usuarioKey: this.userAuth.uid,
    } as ConteudoDb);
  }

  removeConteudo(key: string) {
    this.paymentService.cancelarConteudo(key);
  }

  async logOut() {
    const usuario = await firstValueFrom(
      this.usuariosDbService.getUsuarioById(this.userAuth.uid)
    );
    if (usuario) {
      await this.usuariosDbService.updateUsuario(this.userAuth.uid, {
        ...usuario,
        logado: false,
      });
    }
    await this.authService.signOut();
  }

  async deleteCurrentUser() {
    await this.limparComprasUsuario();
    await this.limparConteudosUsuario();
    await this.usuariosDbService.deleteUsuario(this.userAuth.uid);
    await this.authService.deleteCurrentUser();
  }

  async limparComprasUsuario(): Promise<void> {
    try {
      const promises: Promise<void>[] = [];
      this.compras.forEach((compra) => {
        promises.push(
          this.paymentService
            .cancelarCompra(compra.key || '')
            .catch((error) => {
              this.messageService.showErrorMessage(
                `Erro ao excluir compra ${compra.key}: ` + error
              );
              throw error;
            })
        );
      });

      await Promise.all(promises);
    } catch (error) {
      this.messageService.showErrorMessage(
        'Erro ao limpar compras do usuário: ' + error
      );
      throw error;
    }
  }

  async limparConteudosUsuario(): Promise<void> {
    try {
      if (this.permissaoUsuario < 2) {
        return;
      }
      const promises: Promise<void>[] = [];
      this.conteudos.forEach((conteudo) => {
        promises.push(
          this.paymentService
            .cancelarConteudo(conteudo.key || '')
            .catch((error) => {
              this.messageService.showErrorMessage(
                `Erro ao excluir conteudo ${conteudo.key}: ` + error
              );
              throw error;
            })
        );
      });

      await Promise.all(promises);
    } catch (error) {
      this.messageService.showErrorMessage(
        'Erro ao limpar conteudos do usuário: ' + error
      );
      throw error;
    }
  }
}
