<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use App\Service\JsonConverter;
use App\Service\ApiLinker;
use Symfony\Component\HttpFoundation\Response;

class LikeDislikeController extends AbstractController
{
	private $apiLinker;

    public function __construct(ApiLinker $apiLinker)
    {
        $this->apiLinker = $apiLinker;
    }

	public function createReaction() {
		
	}

}