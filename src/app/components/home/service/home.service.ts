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
import { ActivatedRoute } from '@angular/router';
import { RedirectService } from '../../../services/redirect/redirect.service';
import { ImagestorageService } from '../../../services/imagestorage/imagestorage.service';
import { FirestoreStripePaymentsService } from './firestore-stripe-payments.service';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  usuarioEstaLogado = false;
  usuarios: UsuarioDb[] = [];
  usuarioSubscription: Subscription | undefined;
  permissaoUsuario = 0;
  creatorContent: any = null;
  userAuth: any;
  userAuthSubscription: Subscription | undefined;

  compras: CompraDb[] = [];
  comprasSubscription: Subscription | undefined;
  conteudos: ConteudoDb[] = [];
  conteudosSubscription: Subscription | undefined;

  constructor(
    private route: ActivatedRoute,
    public authService: AuthService,
    public conteudoDbService: ConteudodbService,
    public compraDbService: CompradbService,
    public usuariosDbService: UsuariodbService,
    public paymentService: PaymentService,
    public imagestorageService: ImagestorageService,
    public messageService: PMessageService,
    public conteudocompradbService: ConteudocompradbService,
    public firestoreStripePaymentsService: FirestoreStripePaymentsService,
    public redirects: RedirectService
  ) {}

  onInit() {
    this.userAuthSubscription = this.authService.user.subscribe((user) => {
      this.userAuth = user;
      if (user) {
        this.userPageInit(user);
      } else {
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

  async handleUsuarioDbLoginRegister(usuario: UsuarioDb) {
    if (this.usuarioEstaLogado != usuario.logado) {
      if (!usuario.logado) {
        await this.authService.signOut();
      }
      this.usuarioEstaLogado = Boolean(usuario.logado);
    }

    if (this.usuarioEstaLogado) {
      this.handleUserPageByPermissionLevel(usuario.nivel_permissao || 0);
    }
  }

  async handleContentPlacer(userEmail: string) {
    const placer = await firstValueFrom(
      this.usuariosDbService.getUsuarioByEmail(userEmail)
    );
    if (placer) {
      this.creatorContent = placer;
    }
  }

  async handleUserPageByPermissionLevel(permissionLvl: number) {
    this.permissaoUsuario = permissionLvl;
    if (!permissionLvl) {
      return;
    }
    this.conteudos = [];
    this.compras = [];
    this.creatorContent = null;
    if (permissionLvl == 1) {
      const placerEmailByUrl = this.route.snapshot.queryParams['placer'];
      if (placerEmailByUrl) {
        await this.handleContentPlacer(placerEmailByUrl);
        this.consultarConteudos(this.creatorContent.key);
        this.consultarCompras();
        return;
      }
      this.logOut();
    }
    if (permissionLvl == 2) {
      await this.handleContentPlacer(this.userAuth.email);
      this.consultarConteudos(this.userAuth.uid);
    }
  }

  async userPageInit(user: any) {
    this.usuarioSubscription = this.usuariosDbService
      .getUsuarioObservableById(user.uid)
      .valueChanges()
      .subscribe((usuario: UsuarioDb | null) => {
        if (!usuario) {
          return;
        }
        this.handleUsuarioDbLoginRegister(usuario);
      });

    this.firestoreStripePaymentsService.onCurrentUserSubscriptionUpdate();
  }

  userPageFinalize() {
    this.compras = [];
    this.conteudos = [];
    this.usuarios = [];
    this.creatorContent = null;
    if (this.usuarioSubscription) {
      this.usuarioSubscription.unsubscribe();
    }
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
          nome: this.userAuth.email,
          nivel_permissao: 1,
          logado: true,
          foto_perfil: this.userAuth.photoURL,
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

  async alterarInfosUsuarioLogado(
    nomeUsuairo: string,
    foto_perfil: string | null | undefined
  ) {
    if (this.userAuth) {
      const usuario = await firstValueFrom(
        this.usuariosDbService.getUsuarioById(this.userAuth.uid)
      );
      if (usuario) {
        await this.authService.updateProfile(nomeUsuairo, foto_perfil);
        await this.usuariosDbService.updateUsuario(
          this.userAuth.uid,
          foto_perfil
            ? {
                ...usuario,
                nome: nomeUsuairo,
                foto_perfil,
              }
            : {
                ...usuario,
                nome: nomeUsuairo,
              }
        );
      }
    }
  }

  async googleSignin() {
    await this.authService.googleSignin();
    await this.handleAcessoUsuario(true);
  }

  async facebookSignin() {
    await this.authService.facebookSignin();
    await this.handleAcessoUsuario(true);
  }

  async comprar(conteudo: ConteudoDb) {
    this.paymentService.comprar(conteudo, this.userAuth.uid);
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
      return;
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
    this.authService.loadingUser = true;
    await this.imagestorageService.deleteAllImagesInFolder(
      `arquivos/${this.userAuth.email}`
    );
    await this.limparComprasUsuario();
    await this.limparConteudosUsuario();
    await this.usuariosDbService.deleteUsuario(this.userAuth.uid);
    await this.authService.deleteCurrentUser();
    this.authService.loadingUser = false;
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
