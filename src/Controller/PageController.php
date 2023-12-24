<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use App\Service\JsonConverter;
use App\Service\ApiLinker;
use Symfony\Component\HttpFoundation\Response;

class PageController extends AbstractController
{

    private $apiLinker;
    private $jsonConverter;

    public function __construct(ApiLinker $apiLinker, JsonConverter $jsonConverter)
    {
        $this->apiLinker = $apiLinker;
        $this->jsonConverter = $jsonConverter;
    }

    #[Route('/login', methods: ['GET'])]
    public function displayConnexionPage()
    {
        return $this->render('connexion.html.twig', ['page' => 'connexion']);
    }

    #[Route('/changePass', methods: ['POST'])]
    public function changePass(Request $request)
    {
        $session = $request->getSession();
        $token = $session->get('token-session');
        $dataId = htmlspecialchars($_POST["id"]);
        $dataPass = htmlspecialchars($_POST["password"]);
        $data = $this->jsonConverter->encodeToJson(["id" => $dataId, "password" => $dataPass]);
        $response = $this->apiLinker->putData('/changePass', $data, $token);
        return $this->redirect('/profil');
    }

    #[Route('/createComm', methods: ['POST'], name: 'api_create_comment')]
    public function createComm(Request $request)
    {
        $session = $request->getSession();
        $token = $session->get('token-session');

        $myselfResponse = $this->apiLinker->getData('/myself', $token);
        $myselfData = json_decode($myselfResponse);
        $dataAuteurId = $myselfData->id;

        $dataContenu = htmlspecialchars($request->request->get("contenu"));
        $dataDate = htmlspecialchars($request->request->get("dateComm"));
        $dataPublication = htmlspecialchars($request->request->get("publication"));
        $dataParentCommentId = htmlspecialchars($request->request->get("parentCommentId"));

        $data = $this->jsonConverter->encodeToJson([
            "contenu" => $dataContenu,
            "dateComm" => $dataDate,
            "auteur_id" => $dataAuteurId,
            "publication" => $dataPublication,
            "parentCommentId" => $dataParentCommentId,
        ]);

        $response = $this->apiLinker->postData('/commentaires', $data, $token);
        return $this->redirect('/');
    }

    #[Route('/createCommReply', methods: ['POST'], name: 'api_create_comment_reply')]
    public function createCommReply(Request $request)
    {
        $session = $request->getSession();
        $token = $session->get('token-session');

        $myselfResponse = $this->apiLinker->getData('/myself', $token);
        $myselfData = json_decode($myselfResponse);
        $dataAuteurId = $myselfData->id;

        $dataContenu = htmlspecialchars($request->request->get("contenu"));
        $dataDate = htmlspecialchars($request->request->get("dateComm"));
        $dataPublication = htmlspecialchars($request->request->get("publication"));
        $dataParentCommentId = htmlspecialchars($request->request->get("parentCommentId"));

        $data = $this->jsonConverter->encodeToJson([
            "contenu" => $dataContenu,
            "dateComm" => $dataDate,
            "auteur_id" => $dataAuteurId,
            "publication" => $dataPublication,
            "parentCommentId" => $dataParentCommentId,
        ]);

        $response = $this->apiLinker->postData('/commentaires', $data, $token);

        return $this->redirect('/');
    }
    #[Route('/publications', methods: ['POST'], name: 'edit_publication')]
    public function editPublication(Request $request)
    {
        $session = $request->getSession();
        $token = $session->get('token-session');
        $dataIdPost = htmlspecialchars($_POST["id"]);
        $dataDescription = htmlspecialchars($request->request->get("description"));

        $data = $this->jsonConverter->encodeToJson(["id" => $dataIdPost, "description" => $dataDescription]);

        $response = $this->apiLinker->putData('/publications', $data, $token);

        return $this->redirect('/profil');
    }
    #[Route('/publications/{id}', methods: ['DELETE'], name: 'delete_publication')]
    public function deletePublication($id, Request $request)
    {
        $session = $request->getSession();
        $token = $session->get('token-session');
        $response = $this->apiLinker->deleteData('/publications/' . $id, $token);
        return $this->redirect('/profil');
    }
    #[Route('/profil/avatar', methods: ['POST'], name: 'upload_avatar')]
    public function uploadAvatar(Request $request): Response
    {
        $user = $this->getUser();
        $file = $request->files->get('avatar');

        if ($file) {
            $fileName = md5(uniqid()) . '.' . $file->guessExtension();
            $file->move($this->getParameter('avatar_directory'), $fileName);
            $user->setAvatar($fileName);

            return $this->redirectToRoute('profil');
        }

        return new Response('Error uploading avatar', 400);
    }

    /*#[Route('/publications', methods: ['POST'])]
    public function createPost(Request $request)
    {
        $session = $request->getSession();
        $token = $session->get('token-session');

        $dataDescription = htmlspecialchars($_POST["description"]);

        //pour gérer les images?? pas fonctionnel
        //$photoFile = $request->files->get('photo');

        //$photoPath = '/public/images/' . $photoFile->getClientOriginalName();
        //$photoFile->move('/public/images/', $photoFile->getClientOriginalName());

        $data = $this->jsonConverter->encodeToJson(["description" => $dataDescription, "photo" => $photoPath]);
        $response = $this->apiLinker->postData('/publications', $data, $token);

        return $this->redirect('/');
    }*/

    #[Route('/inscription', methods: ['GET'])]
    public function displayInscriptionPage()
    {
        return $this->render('inscription.html.twig', ['page' => 'inscription']);
    }

    #[Route('/profil', methods: ['GET'])]
    public function displayProfilPage(Request $request)
    {
        $session = $request->getSession();
        $token = $session->get('token-session');
        if ($session->get('isUserConnected')) {
            if ($this->isTokenExpired($session->get('expiration'))) {
                $session->remove('token-session');
                $session->clear();
                return $this->redirect('/login');
            }
        }
        $response = $this->apiLinker->getData('/myself', $token);
        $user = json_decode($response);
        return $this->render('profil.html.twig', ['user' => $user, 'page' => 'profil']);
    }

    #[Route('/user/{id}', methods: ['GET'], name: 'display_profil_by_id')]
    public function displayProfilPageById($id, Request $request)
    {
        $session = $request->getSession();
        $token = $session->get('token-session');
        if ($session->get('isUserConnected')) {
            if ($this->isTokenExpired($session->get('expiration'))) {
                $session->remove('token-session');
                $session->clear();
                return $this->redirect('/login');
            }
        }
        $response = $this->apiLinker->getData('/user/' . $id, $token);
        $user = json_decode($response);
        return $this->render('profil.html.twig', ['user' => $user, 'page' => 'profil']);
    }

    #[Route('/publications/{id}', methods: ['GET'], name: 'display_publication_by_id')]
    public function displayPublicationsByIdPage($id, Request $request)
    {
        $session = $request->getSession();
        $token = $session->get('token-session');
        if ($session->get('isUserConnected')) {
            if ($this->isTokenExpired($session->get('expiration'))) {
                $session->remove('token-session');
                $session->clear();
                return $this->redirect('/login');
            }
        }

        $publicationDetails = $this->apiLinker->getData('/publications/' . $id, $token);
        $publication = json_decode($publicationDetails);

        $publicationString = json_encode($publication);

        return new Response($publicationString);
    }

    #[Route('/', methods: ['GET'])]
    public function displayAccueilPageBis(Request $request)
    {
        $role = NULL;
        $session = $request->getSession();
        $token = $session->get('token-session');
        if ($session->get('isUserConnected')) {
            if ($this->isTokenExpired($session->get('expiration'))) {
                $session->remove('token-session');
                $session->clear();
                return $this->redirect('/login');
            }
        }
        $posts = $this->apiLinker->getData('/publications', $token);

        // récupération du rôle de l'utilisateur courant
        if ($token) {
            $jsonUser = $this->apiLinker->getData('/myself', $token);
            $user = json_decode($jsonUser);
            $role = 'membre';
            if (!isset($user->roles)) {
                $session->remove('token-session');
                $session->clear();
                return $this->render('connexion.html.twig', ['response' => 'Votre session a expiré.', 'page' => 'connexion']);
            }
            if (in_array('ROLE_ADMIN', $user->roles)) {
                $role = 'admin';
            }
        }

        $arrayPosts = json_decode($posts);
        shuffle($arrayPosts);
        $session->set('role', $role);

        return $this->render('accueil.html.twig', ['page' => 'accueil', 'posts' => $arrayPosts]);
    }

    #[Route('/publications', name: 'update_description', methods: ['PUT'])]
    public function updateDescription(Request $request)
    {

    }

    #[Route('/users', methods: ['GET'], condition: "service('route_checker').checkAdmin(request)")]
    public function displayUtilisateursPage(Request $request)
    {
        $session = $request->getSession();
        $token = $session->get('token-session');
        if ($session->get('isUserConnected')) {
            if ($this->isTokenExpired($session->get('expiration'))) {
                $session->remove('token-session');
                $session->clear();
                return $this->redirect('/login');
            }
        }

        $response = $this->apiLinker->getData('/users', $token);
        $users = json_decode($response);

        return $this->render('users.html.twig', ['page' => 'Modération', 'users' => $users]);
    }

    #[Route('/ban/{userId}', methods: ['PUT'])]
    public function banUser($userId, Request $request)
    {
        $session = $request->getSession();
        $token = $session->get('token-session');
        if ($session->get('isUserConnected')) {
            if ($this->isTokenExpired($session->get('expiration'))) {
                $session->remove('token-session');
                $session->clear();
                return $this->redirect('/login');
            }
        }
        $response = $this->apiLinker->updateData('/ban/' . $userId, $token);

        return new Response($response);
    }

    #[Route('/unban/{userId}', methods: ['PUT'])]
    public function unbanUser($userId, Request $request)
    {
        $session = $request->getSession();
        $token = $session->get('token-session');
        if ($session->get('isUserConnected')) {
            if ($this->isTokenExpired($session->get('expiration'))) {
                $session->remove('token-session');
                $session->clear();
                return $this->redirect('/login');
            }
        }
        $response = $this->apiLinker->updateData('/unban/' . $userId, $token);

        return new Response($response);
    }

    #[Route('/lock/{postId}', methods: ['PUT'])]
    public function lockPost($postId, Request $request)
    {
        $session = $request->getSession();
        $token = $session->get('token-session');
        if ($session->get('isUserConnected')) {
            if ($this->isTokenExpired($session->get('expiration'))) {
                $session->remove('token-session');
                $session->clear();
                return $this->redirect('/login');
            }
        }
        $response = $this->apiLinker->updateData('/lock/' . $postId, $token);

        return new Response($response);
    }

    #[Route('/unlock/{postId}', methods: ['PUT'])]
    public function unlockPost($postId, Request $request)
    {
        $session = $request->getSession();
        $token = $session->get('token-session');
        if ($session->get('isUserConnected')) {
            if ($this->isTokenExpired($session->get('expiration'))) {
                $session->remove('token-session');
                $session->clear();
                return $this->redirect('/login');
            }
        }
        $response = $this->apiLinker->updateData('/unlock/' . $postId, $token);

        return new Response($response);
    }

    private function isTokenExpired($expirationTime)
    {
        $currentTime = time();

        if ($expirationTime instanceof \DateTime && $expirationTime < $currentTime) {
            return true;
        } else {
            return false;
        }
    }
}
