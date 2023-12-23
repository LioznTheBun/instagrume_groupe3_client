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
        $tokenParts = explode('.', $response);
        $encodedPayload = $tokenParts[1];
        $decodedPayload = base64_decode($encodedPayload);
        $payload = json_decode($decodedPayload, true);
        $expirationDate = $payload['exp'];
        
        if (!is_String($responseObject)) {

            $session = $request->getSession();
            $session->set('token-session', $responseObject->token);
            $jsonUser = $this->apiLinker->getData('/myself', $responseObject->token);
            $user = json_decode($jsonUser);
            $role = 'membre';
            if (in_array('ROLE_ADMIN', $user->roles)) {
                $role = 'admin';
            }
            $session->set('idUser', $user->id);
            $session->set('role', $role);
            $session->set('isUserConnected', true);
            $session->set('expiration', $expirationDate);

            return $this->redirect('/');
        }
        return $this->render('connexion.html.twig', ['response' => $responseObject, 'page' => 'connexion']);
    }

    #[Route('/logout', methods: ['GET'])]
    public function deconnexion(Request $request)
    {
        $session = $request->getSession();
        $session->remove('token-session');
        $session->clear();
        $session->set('isUserConnected', false);

        return $this->redirect('/');
    }
}
