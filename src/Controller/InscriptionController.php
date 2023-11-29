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
        //TODO: Créer des sécurité sur si qq'un utilise le même pseudo/email
        $session = $request->getSession();
        $token = $session->get('token-session');

        $email = $request->request->get('email');
        $pseudo = $request->request->get('pseudo');
        $password = $request->request->get('password');

        if (!empty($email) && !empty($pseudo) && !empty($password)) {
            $data = $this->jsonConverter->encodeToJson([
                'email' => $email,
                'roles' => ["ROLE_USER"],
                'pseudo' => $pseudo,
                'password' => $password,
                'avatar' => 'img',
                'is_banned' => false,
                
            ]);

            $response = $this->apiLinker->postData('/inscription', $data, $token);
            $responseObject = json_decode($response);

            return $this->redirect('/login');
        }

        return $this->redirect('/inscription');
    }
}
