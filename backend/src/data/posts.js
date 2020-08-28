const POST_BODY = `
    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

    It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accpostIdent, sometimes on purpose (injected humour and the like).
`;


const posts = 
[
    {
        postId: 'b1827e99-2cd6-45b4-8574-7e32a3d6633d',
        title: 'Title - 1',
        shortDescription: 'Lorem Ipsum is simply dummy text of the printing', 
        body: POST_BODY,
        createdAt: '2020-08-23T12:17:17.278Z',
        updatedAt: '2020-08-24T12:17:17.278Z'
    },
    {
        postId: '1bcc867b-45bc-4a48-99b2-49ef62082e80',
        title: 'Title - 2', 
        shortDescription: 'Lorem Ipsum is simply dummy text of the printing', 
        body: POST_BODY,
        createdAt: '2020-08-23T12:17:17.278Z',
        updatedAt: '2020-08-24T12:17:17.278Z'
    },
    {
        postId: '811d6441-fe5d-4c3e-946a-989e41f1de7e',
        title: 'Title - 3', 
        shortDescription: 'Lorem Ipsum is simply dummy text of the printing', 
        body: POST_BODY,
        createdAt: '2020-08-23T12:17:17.278Z',
        updatedAt: '2020-08-24T12:17:17.278Z'
    },
    {
        postId: '377794da-a21f-422e-bcc7-a86488544fc8',
        title: 'Title - 4',
        shortDescription: 'Lorem Ipsum is simply dummy text of the printing', 
        body: POST_BODY,
        createdAt: '2020-08-23T12:17:17.278Z',
        updatedAt: '2020-08-24T12:17:17.278Z'
    },
    {
        postId: 'b3b6772a-2795-4e2b-a44f-20db74452b54',
        title: 'Title - 5', 
        shortDescription: 'Lorem Ipsum is simply dummy text of the printing', 
        body: POST_BODY,
        createdAt: '2020-08-23T12:17:17.278Z',
        updatedAt: '2020-08-24T12:17:17.278Z'
    },
    {
        postId: '53ffe3a0-d720-4dee-b477-2c39e8afb4e6',
        title: 'Title - 6', 
        shortDescription: 'Lorem Ipsum is simply dummy text of the printing', 
        body: POST_BODY,
        createdAt: '2020-08-23T12:17:17.278Z',
        updatedAt: '2020-08-24T12:17:17.278Z'
    },
    {
        postId: 'bab5efe1-2b11-49b9-9445-1683f5d2c450',
        title: 'Title - 7',
        shortDescription: 'Lorem Ipsum is simply dummy text of the printing', 
        body: POST_BODY,
        createdAt: '2020-08-23T12:17:17.278Z',
        updatedAt: '2020-08-24T12:17:17.278Z'
    },
    {
        postId: '0b3aeb49-ea04-4d0a-82d0-8e728905d027',
        title: 'Title - 8', 
        shortDescription: 'Lorem Ipsum is simply dummy text of the printing', 
        body: POST_BODY,
        createdAt: '2020-08-23T12:17:17.278Z',
        updatedAt: '2020-08-24T12:17:17.278Z'
    },
    {
        postId: '0d10bbf3-aafb-4f5c-b830-28603d7c9975',
        title: 'Title - 9', 
        shortDescription: 'Lorem Ipsum is simply dummy text of the printing', 
        body: POST_BODY,
        createdAt: '2020-08-23T12:17:17.278Z',
        updatedAt: '2020-08-24T12:17:17.278Z'
    }                                                            
];

module.exports = { posts }