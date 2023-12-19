<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

use App\Service\ApiLinker;



class PublicationController extends AbstractController
{

    private $apiLinker;

    public function __construct(ApiLinker $apiLinker)
    {
        $this->apiLinker = $apiLinker;
    }

    #[Route('/publications', methods: ['POST'])]
    public function createPublication()
    {
        $request = Request::createFromGlobals();
        $data = $request->getContent();
        $response = $this->apiLinker->createData('/publications', $data);

        return new Response($response);
    }
}