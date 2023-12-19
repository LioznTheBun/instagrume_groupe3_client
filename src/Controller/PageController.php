<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

use App\Service\ApiLinker;
use Symfony\Component\HttpFoundation\Response;


class PageController extends AbstractController
{

    private $apiLinker;

    public function __construct(ApiLinker $apiLinker)
    {
        $this->apiLinker = $apiLinker;
    }

    #[Route('/login', methods: ['GET'])]
    public function displayConnexionPage()
    {
        return $this->render('connexion.html.twig', ['page' => 'connexion']);
    }

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
                return $this->render('connexion.html.twig', ['response' => 'Votre session à expiré.', 'page' => 'connexion']);
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
        $response = $this->apiLinker->updateData('/ban' . $userId, $token);

        return new Response(json_decode($response));
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
        $response = $this->apiLinker->updateData('/unban' . $userId, $token);

        return new Response(json_decode($response));
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
