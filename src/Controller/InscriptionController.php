<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

use App\Service\JsonConverter;
use App\Service\ApiLinker;
use Symfony\Component\HttpFoundation\RedirectResponse;

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
        $responseObject = "";
        $session = $request->getSession();
        $token = $session->get('token-session');

        $email = $request->request->get('email');
        $pseudo = $request->request->get('pseudo');
        $password = $request->request->get('password');
        $avatar = "";//$request->request->get('avatar') ?


        $data = $this->jsonConverter->encodeToJson([
            'email' => $email,
            'pseudo' => $pseudo,
            'password' => $password,
            'avatar' => $avatar
        ]);

        $response = $this->apiLinker->postData('/inscription', $data, $token);
        $responseObject = json_decode($response);

        return $this->render('inscription.html.twig', ['response' => $responseObject, 'role' => NULL, 'page' => 'inscription']);
    }
}
