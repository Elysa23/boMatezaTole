<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Produit;
use App\Repository\ProduitRepository;
use App\Repository\CategorieRepository;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class TestController extends AbstractController
{
    #[Route('api/test', name: 'api_test', methods: ['GET'])]
    public function index(ProduitRepository $produitRepository): Response
    {
        $produits = $produitRepository->findAll();
        $data = array_map(function($produit) {
    return [
        'id' => $produit->getId(),
        'nom' => $produit->getNom(),
        'prix' => $produit->getPrix(),
        'reference' => $produit->getReference(),
        'stock' => $produit->getStock(),
        'description' => $produit->getDescription(),
        'categorie' => $produit->getCategorie()?->getId(),
        'photo' => $produit->getPhoto(),
    ];
}, $produits);

return $this->json($data);
    }

   /* #[Route('/api/produit/{id}', name: 'api_test_show', methods: ['GET'])]
    public function show(int $id): Response
    {
          $produits = [
        ['id' => 1, 'nom' => 'T-shirt', 'prix' => 45000],
        ['id' => 2, 'nom' => 'Pantalon', 'prix' => 85000],
        ['id' => 3, 'nom' => 'Casquette', 'prix' => 25000]
    ];

    $produitTrouve = null;
    foreach ($produits as $produit) {
        if($produit['id'] === $id) {
            $produitTrouve = $produit;
            break;
        }

      

    }
     if($produitTrouve === null) {
            return $this->json(['message' => 'Produit non trouvé'], 404);
        }

    return $this->json($produitTrouve);
    }
*/
  
    
/*#[Route('/api/produits', name: 'liste_produits', methods: ['GET'])]
public function search(Request $request): Response
{
    $produits = [
        ['id' => 1, 'nom' => 'T-shirt', 'prix' => 45000],
        ['id' => 2, 'nom' => 'Pantalon', 'prix' => 85000],
        ['id' => 3, 'nom' => 'Casquette', 'prix' => 25000],
        ['id' => 4, 'nom' => 'Pantalon noir', 'prix' => 95000]
    ];

    $resultats = [];
    $query = $request->query->get('nom', '');

    foreach ($produits as $produit) {
        if ($query === '' || stripos($produit['nom'], $query) !== false) {
            $resultats[] = $produit;
        }
    }

    if (empty($resultats)) {
        return $this->json([
            'message' => 'Produit introuvable'
        ], 404);
    }

    return $this->json([
        'status' => 'success',
        'produits' => $resultats
    ]);
}*/

#[Route('/api/produits', name: 'api_test_search', methods: ['GET'])]
public function search(Request $request, ProduitRepository $produitRepository): Response
{
    $nom = $request->query->get('nom');
    $prix = $request->query->get('prix');

    $qb = $produitRepository->createQueryBuilder('p');
    if(!empty($nom)) {
        $qb->andWhere('p.nom LIKE :nom')
           ->setParameter('nom', '%'.$nom.'%');
    }
    if($prix !==null && $prix !== '') {
        $qb->andWhere('p.prix <= :prix')
           ->setParameter('prix', $prix);
    }

    $produits = $qb->getQuery()->getResult();
    $data = array_map(function($produit) {
    return [
        'id' => $produit->getId(),
        'nom' => $produit->getNom(),
        'prix' => $produit->getPrix(),
        'reference' => $produit->getReference(),
        'stock' => $produit->getStock(),
        'description' => $produit->getDescription(),
        'categorie' => $produit->getCategorie()?->getId(),
        'photo' => $produit->getPhoto(),
    ];
}, $produits);

return $this->json($data);

    return $this->json($produits);
}

#[Route('/api/produits', name: 'api_test_store', methods: ['POST'])]
public function store(Request $request, EntityManagerInterface $entityManager, CategorieRepository $categorieRepository): Response
{
    $data = $request->getPayload()->all();

    if (!isset($data['nom'], $data['prix'], $data['reference'], $data['stock'], $data['categorie'])) {
        return $this->json([
            'message' => 'Les champs du produit ne sont pas arrivés au serveur. Vérifiez l’envoi avec FormData et la limite PHP post_max_size ('.ini_get('post_max_size').').'
        ], 400);
    }

    $produit = new Produit();
    $produit->setNom($data['nom']);
    $produit->setPrix($data['prix']);
    $produit->setReference($data['reference']);
    $produit->setStock($data['stock']);
    $produit->setDescription($data['description']);

    $categorie = $categorieRepository->find($data['categorie']);
    if($categorie === null) {
        return $this->json([
            'status' => 'error',
            'message' => 'Catégorie introuvable'
        ], 404);
    }
    $produit->setCategorie($categorie);

    $fichierPhoto = $request->files->get('photo');
    $cheminPhoto = null;
    if ($fichierPhoto instanceof UploadedFile) {
        $erreurPhoto = $this->verifierPhoto($fichierPhoto);
        if ($erreurPhoto !== null) {
            return $this->json(['message' => $erreurPhoto], 400);
        }

        $cheminPhoto = $this->enregistrerPhoto($fichierPhoto);
        $produit->setPhoto($cheminPhoto);
    }

    $entityManager->persist($produit);
    try {
        $entityManager->flush();
    } catch (\Throwable $erreur) {
        if ($cheminPhoto !== null) {
            $this->supprimerPhoto($cheminPhoto);
        }
        throw $erreur;
    }

    return $this->json(
       [
        'status' => 'success',
        'message' => 'Produit créé avec succès',
        'produit' => [
            'id' => $produit->getId(),
            'nom' => $produit->getNom(),
            'prix' => $produit->getPrix(),
            'reference' => $produit->getReference(),
            'stock' => $produit->getStock(),
            'description' => $produit->getDescription(),
            'categorie' => $produit->getCategorie()?->getId(),
            'photo' => $produit->getPhoto(),
        ]
       ] , 201);
}

#[Route('/api/produits/{id}', name: 'api_test_patch', methods: ['PATCH'])]
public function update(
    int $id,
    Request $request,
    ProduitRepository $produitRepository,
    CategorieRepository $categorieRepository,
    EntityManagerInterface $entityManager
): Response {

    // 1. Récupérer le produit
    $produit = $produitRepository->find($id);

    // 2. Vérifier si le produit existe
    if ($produit === null) {
        return $this->json([
            'message' => 'Produit introuvable'
        ], 404);
    }

    // 3. Récupérer les données envoyées par le client
    $data = $request->getPayload()->all();

    $fichierPhoto = $request->files->get('photo');
    $nouveauCheminPhoto = null;
    $anciennePhoto = $produit->getPhoto();
    $retirerPhoto = ($data['retirerPhoto'] ?? 'false') === 'true';

    if ($data === [] && !$request->files->has('photo')) {
        return $this->json([
            'message' => 'Aucune donnée de modification n’a été reçue. Vérifiez le formulaire multipart.'
        ], 400);
    }

    if ($fichierPhoto instanceof UploadedFile) {
        $erreurPhoto = $this->verifierPhoto($fichierPhoto);
        if ($erreurPhoto !== null) {
            return $this->json(['message' => $erreurPhoto], 400);
        }
    }

    // 4. Modifier uniquement les champs transmis
    if (isset($data['nom'])) {
        $produit->setNom($data['nom']);
    }

    if (isset($data['prix'])) {
        $produit->setPrix($data['prix']);
    }

    if (isset($data['categorie'])) {
        $categorie = $categorieRepository->find($data['categorie']);
        if ($categorie === null) {
            return $this->json([
                'message' => 'Catégorie introuvable'
            ], 404);
        }
        $produit->setCategorie($categorie);
    }

    if (isset($data['reference'])) {
        $produit->setReference($data['reference']);
    }   
    if (isset($data['stock'])) {
        $produit->setStock($data['stock']);
    }
    if (array_key_exists('description', $data)) {
        $produit->setDescription($data['description']);
    }

    if ($fichierPhoto instanceof UploadedFile) {
        $nouveauCheminPhoto = $this->enregistrerPhoto($fichierPhoto);
        $produit->setPhoto($nouveauCheminPhoto);
    } elseif ($retirerPhoto) {
        $produit->setPhoto(null);
    }

    // 5. Enregistrer les modifications
    try {
        $entityManager->flush();
    } catch (\Throwable $erreur) {
        if ($nouveauCheminPhoto !== null) {
            $this->supprimerPhoto($nouveauCheminPhoto);
        }
        throw $erreur;
    }

    // L'ancienne image est supprimée seulement après l'enregistrement en base.
    if (($nouveauCheminPhoto !== null || $retirerPhoto) && $anciennePhoto !== null) {
        $this->supprimerPhoto($anciennePhoto);
    }

    // 6. Retourner les informations actualisées
    return $this->json([
        'message' => 'Success',
        'produit' => [
            'id' => $produit->getId(),
            'nom' => $produit->getNom(),
            'prix' => $produit->getPrix(),
            'reference' => $produit->getReference(),
            'stock' => $produit->getStock(),
            'description' => $produit->getDescription(),
            'categorie' => $produit->getCategorie()?->getId(),
            'photo' => $produit->getPhoto(),
        ]
    ]);
}

#[Route('/api/produits/{id}', name: 'test_api_delete', methods: ['DELETE'])]
public function delete(
    int $id,
    EntityManagerInterface $entityManager,
    ProduitRepository $produitRepository
): Response {

    $produit = $produitRepository->find($id);

    if ($produit === null) {
        return $this->json([
            'message' => 'Produit introuvable'
        ], 404);
    }

    $anciennePhoto = $produit->getPhoto();
    $entityManager->remove($produit);
    $entityManager->flush();

    if ($anciennePhoto !== null) {
        $this->supprimerPhoto($anciennePhoto);
    }

    return $this->json([
        'message' => 'Suppression effectuée avec succès'
    ]);
}

private function verifierPhoto(UploadedFile $fichier): ?string
{
    if (!$fichier->isValid()) {
        return 'Le fichier image n’a pas pu être envoyé.';
    }

    if ($fichier->getSize() > 2 * 1024 * 1024) {
        return 'La photo ne doit pas dépasser 2 Mo.';
    }

    $informationsImage = @getimagesize($fichier->getPathname());
    if ($informationsImage === false) {
        return 'Le fichier sélectionné n’est pas une image valide.';
    }

    $typesAutorises = [IMAGETYPE_JPEG, IMAGETYPE_PNG, IMAGETYPE_GIF, IMAGETYPE_WEBP];
    if (!in_array($informationsImage[2], $typesAutorises, true)) {
        return 'Le format de la photo doit être JPEG, PNG, GIF ou WebP.';
    }

    return null;
}

private function enregistrerPhoto(UploadedFile $fichier): string
{
    $informationsImage = getimagesize($fichier->getPathname());
    $extensions = [
        IMAGETYPE_JPEG => 'jpg',
        IMAGETYPE_PNG => 'png',
        IMAGETYPE_GIF => 'gif',
        IMAGETYPE_WEBP => 'webp',
    ];
    $nomFichier = bin2hex(random_bytes(16)).'.'.$extensions[$informationsImage[2]];
    $dossier = $this->getParameter('kernel.project_dir').'/public/uploads/produits';

    if (!is_dir($dossier)) {
        $dossierCree = mkdir($dossier, 0775, true);
        if (!$dossierCree && !is_dir($dossier)) {
            throw new \RuntimeException('Impossible de créer le dossier des photos produits.');
        }
    }

    $fichier->move($dossier, $nomFichier);

    return '/uploads/produits/'.$nomFichier;
}

private function supprimerPhoto(string $cheminPhoto): void
{
    if (!str_starts_with($cheminPhoto, '/uploads/produits/')) {
        return;
    }

    $cheminFichier = $this->getParameter('kernel.project_dir').'/public'.$cheminPhoto;
    if (is_file($cheminFichier)) {
        unlink($cheminFichier);
    }
}
}
