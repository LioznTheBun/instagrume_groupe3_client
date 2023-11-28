<?php

namespace App\Controller;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

use App\Service\ApiLinker;
use phpDocumentor\Reflection\Types\Null_;

class PageController extends AbstractController {

    private $apiLinker;
  
    public function __construct(ApiLinker $apiLinker) {
        $this->apiLinker = $apiLinker;
     }

    #[Route('/', methods: ['GET'])]
    public function displayConnexionPage() {
        return $this->render('accueil.html.twig', ['page' => 'accueil', 'role' => 'null']);
    }

    #[Route('/accueil', methods: ['GET'], condition: "service('route_checker').checkUser(request)")]
    public function displayaccueilPage(Request $request) {
        $session = $request->getSession();
        $token = $session->get('token-session');

        $response = $this->apiLinker->getData('/accueil', $token);
        $accueil = json_decode($response);

        // récupération du rôle de l'utilisateur courant
        $jsonUser = $this->apiLinker->getData('/myself', $token);
        $user = json_decode($jsonUser);
        $role = 'membre';
        if(in_array('ROLE_ADMIN', $user->roles)) {
            $role = 'admin';
        }

        return $this->render('accueil.html.twig', ['accueil' => $accueil, 'role' => $role, 'page' => 'accueil']);
    }

    #[Route('/users', methods: ['GET'], condition: "service('route_checker').checkAdmin(request)")]
    public function displayUtilisateursPage(Request $request) {
        $session = $request->getSession();
        $token = $session->get('token-session');

        $response = $this->apiLinker->getData('/users', $token);
        $users = json_decode($response);

        return $this->render('users.html.twig', ['users' => $users, 'role' => 'admin']);
    }

	
}