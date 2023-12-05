<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

use App\Service\JsonConverter;
use App\Service\ApiLinker;

class ConnexionController extends AbstractController
{

    private $jsonConverter;
    private $apiLinker;

    public function __construct(ApiLinker $apiLinker, JsonConverter $jsonConverter)
    {
        $this->apiLinker = $apiLinker;
        $this->jsonConverter = $jsonConverter;
    }

    #[Route('/login', methods: ['POST'])]
    public function connexion(Request $request)
    {
        $responseObject = "";
        $email = $request->request->get('email');
        $password = $request->request->get('password');

        $data = $this->jsonConverter->encodeToJson(['email' => $email, 'password' => $password]);
        $response = $this->apiLinker->postData('/login', $data, null);
        $responseObject = json_decode($response);

        if (!is_String($responseObject)) {

            $session = $request->getSession();
            $session->set('token-session', $responseObject->token);

            return $this->redirect('/');
        }
        return $this->render('connexion.html.twig', ['response' => $responseObject, 'role' => NULL, 'page' => 'connexion']);
    }

    #[Route('/logout', methods: ['GET'])]
    public function deconnexion(Request $request)
    {
        $session = $request->getSession();
        $session->remove('token-session');
        $session->clear();

        return $this->redirect('/');
    }
}
