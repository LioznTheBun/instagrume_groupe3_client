<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

use App\Service\JsonConverter;
use App\Service\ApiLinker;

class InscriptionController extends AbstractController
{
    private $jsonConverter;
    private $apiLinker;

    public function __construct(ApiLinker $apiLinker, JsonConverter $jsonConverter)
    {
        $this->apiLinker = $apiLinker;
        $this->jsonConverter = $jsonConverter;
    }

    #[Route('/inscription', methods: ['POST'])]
    public function inscription(Request $request)
    {
        $email = $request->request->get('email');
        $pseudo = $request->request->get('pseudo');
        $password = $request->request->get('password');

        if (!empty($email) && !empty($pseudo) && !empty($password)) {
            $data = $this->jsonConverter->encodeToJson([
                'email' => $email,
                'pseudo' => $pseudo,
                'password' => $password,
            ]);

            $response = $this->apiLinker->postData('/inscription', $data, null);
            $responseObject = json_decode($response);

            $session = $request->getSession();
            $session->set('token-session', $responseObject->token);

            return $this->redirect('/connexion');
        }

        return $this->redirect('/inscription');
    }
}
