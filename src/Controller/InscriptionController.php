<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

use App\Service\JsonConverter;
use App\Service\ApiLinker;
use Symfony\Component\HttpFoundation\Response;
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

        $image = $request->files->get('avatar');
        $imageData = file_get_contents($image->getPathName());
        $base64 = base64_encode($imageData);



        $data = $this->jsonConverter->encodeToJson([
            'email' => $email,
            'pseudo' => $pseudo,
            'password' => $password,
            'avatar' => $base64
        ]);

        $response = $this->apiLinker->postData('/inscription', $data, $token);
        $responseObject = json_decode($response);

        return $this->render('inscription.html.twig', ['response' => $responseObject, 'role' => NULL, 'page' => 'inscription']);
    }
}
