<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use App\Service\JsonConverter;
use App\Service\ApiLinker;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class LikeDislikeController extends AbstractController
{
	private $apiLinker;

    public function __construct(ApiLinker $apiLinker)
    {
        $this->apiLinker = $apiLinker;
    }

    #[Route('/likePost/{postId}', methods: ['POST'])]
    public function likePost(Request $request, $postId) {
        $session = $request->getSession();
        $token = $session->get('token-session');
    
        $data = [
            "publication_id" => $postId,
            "user_id" => $session->get('idUser'),
            "action" => 'like',
        ];
    
        $response = $this->apiLinker->postData('/arrayRatingPost', json_encode($data), $token);
    
        return new Response($response);
    }

    #[Route('/dislikePost/{postId}', methods: ['POST'])]
    public function dislikePost(Request $request, $postId) {
        $session = $request->getSession();
        $token = $session->get('token-session');
    
        $data = [
            "publication_id" => $postId,
            "user_id" => $session->get('idUser'),
            "action" => 'dislike',
        ];
    
        $response = $this->apiLinker->postData('/arrayRatingPost', json_encode($data), $token);
    
        return new Response($response);
    }
    
    #[Route('/likeCom/{comId}', methods: ['POST'])]
    public function likeCom(Request $request, $comId) {
        $session = $request->getSession();
        $token = $session->get('token-session');
    
        $data = [
            "commentaire_id" => $comId,
            "user_id" => $session->get('idUser'),
            "action" => 'like',
        ];
    
        $response = $this->apiLinker->postData('/arrayRatingCom', json_encode($data), $token);
    
        return new Response($response);
    }

    #[Route('/dislikeCom/{comId}', methods: ['POST'])]
    public function dislikeCom(Request $request, $comId) {
        $session = $request->getSession();
        $token = $session->get('token-session');
    
        $data = [
            "commentaire_id" => $comId,
            "user_id" => $session->get('idUser'),
            "action" => 'dislike',
        ];
    
        $response = $this->apiLinker->postData('/arrayRatingCom', json_encode($data), $token);
    
        return new Response($response);
    }

}