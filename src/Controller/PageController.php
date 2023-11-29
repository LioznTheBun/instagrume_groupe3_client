<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

use App\Service\ApiLinker;
use phpDocumentor\Reflection\Types\Null_;
use Symfony\Component\Serializer\Encoder\JsonDecode;

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
        return $this->render('accueil.html.twig', ['page' => 'accueil', 'role' => NULL]);
    }

    #[Route('/', methods: ['GET'])]
    public function displayaccueilPage(Request $request)
    {
        $role = NULL;
        $session = $request->getSession();
        $token = $session->get('token-session');

        $posts = $this->apiLinker->getData('/publications', $token);

        // récupération du rôle de l'utilisateur courant
        if ($token) {
            $jsonUser = $this->apiLinker->getData('/myself', $token);
            $user = json_decode($jsonUser);
            $role = 'membre';
            if (in_array('ROLE_ADMIN', $user->roles)) {
                $role = 'admin';
            }
        }

        $arrayPosts = json_decode($posts);
        shuffle($arrayPosts);

        return $this->render('accueil.html.twig', ['role' => $role, 'page' => 'accueil', 'posts' => $arrayPosts]);
    }

    #[Route('/users', methods: ['GET'], condition: "service('route_checker').checkAdmin(request)")]
    public function displayUtilisateursPage(Request $request)
    {
        $session = $request->getSession();
        $token = $session->get('token-session');

        $response = $this->apiLinker->getData('/users', $token);
        $users = json_decode($response);

        return $this->render('users.html.twig', ['users' => $users, 'role' => 'admin']);
    }
}
