<?php

namespace App\Controller;
use App\Repository\CategorieRepository;
use App\Entity\Categorie;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;


class CategorieController extends AbstractController
{
#[Route('/api/categories', name: 'liste_categories', methods: ['GET'])]
public function index(CategorieRepository $categorieRepository): Response
    {
        $categories = $categorieRepository->findAll();
        $data = array_map(function ($categorie) {
            return [
                'id' => $categorie->getId(),
                'nom' => $categorie->getNom(),
            ];
            
        }, $categories);

        return $this->json($data);
    }

}